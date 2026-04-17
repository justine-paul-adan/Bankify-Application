using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services.Interfaces;

namespace WebAPI.Services
{
    public class AccountService : IAccountService
    {
        private readonly BankifyDbContext _context;
        private readonly ILogger<AccountService> _logger;

        public AccountService(BankifyDbContext context, ILogger<AccountService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AccountDto> CreateAccountAsync(CreateAccountDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.Email))
                throw new ArgumentException("Email is required.");

            if (await _context.Accounts.AnyAsync(a => a.Email == dto.Email))
                throw new ArgumentException("Email already exists.");

            var accountNumber = await GenerateUniqueAccountNumberAsync();

            var account = new Account
            {
                AccountRef = Guid.NewGuid().ToString(),
                AccountNumber = accountNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MiddleName = dto.MiddleName,
                Email = dto.Email,
                Location = dto.Location,
                PhoneNumber = dto.PhoneNumber,
                AvailableBalance = dto.AvailableBalance ?? 0,

                // 🔐 Default PIN (force change)
                PinCode = BCryptPin("000000"),
                RequirePinChange = true,

                FailedPinAttempts = 0,
                LockoutEnd = null,

                Status = "Active",
                CreatedDate = DateTime.UtcNow
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Account created: {AccountNumber}", account.AccountNumber);

            return MapToDto(account);
        }

        public async Task<bool> DeleteAccountAsync(int accountNumber)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);

            if (account == null)
                throw new KeyNotFoundException("Account not found");

            // Soft delete
            account.Status = "Deleted";

            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AccountDto?> GetAccountByNumberAsync(int accountNumber)
        {
            var account = await _context.Accounts
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);

            if (account == null)
                throw new KeyNotFoundException("Account not found");

            return MapToDto(account);
        }

        public async Task<List<AccountDto>> GetAllAccountsAsync()
        {
            var accounts = await _context.Accounts
                .AsNoTracking()
                .ToListAsync();

            return accounts.Select(MapToDto).ToList();
        }

        public async Task<AccountDto> UpdateAccountAsync(AccountDto dto)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountNumber == dto.AccountNumber);

            if (account == null)
                throw new KeyNotFoundException("Account not found");

            UpdateAccountFields(account, dto);

            await _context.SaveChangesAsync();

            return MapToDto(account);
        }

        private void UpdateAccountFields(Account account, AccountDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.FirstName))
                account.FirstName = dto.FirstName;

            if (!string.IsNullOrWhiteSpace(dto.LastName))
                account.LastName = dto.LastName;

            if (!string.IsNullOrWhiteSpace(dto.MiddleName))
                account.MiddleName = dto.MiddleName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                account.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Location))
                account.Location = dto.Location;

            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                account.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.Status))
                account.Status = dto.Status;
        }

        private string BCryptPin(string pin)
        {
            return BCrypt.Net.BCrypt.HashPassword(pin);
        }

        private async Task<int> GenerateUniqueAccountNumberAsync()
        {
            int accountNumber;

            do
            {
                accountNumber = GenerateSecureAccountNumber();
            }
            while (await _context.Accounts.AnyAsync(a => a.AccountNumber == accountNumber));

            return accountNumber;
        }

        private int GenerateSecureAccountNumber()
        {
            var bytes = new byte[5];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);

            var number = BitConverter.ToInt32(bytes, 0);
            number = Math.Abs(number);

            return (number % 900_000_000) + 100_000_000;
        }
        private AccountDto MapToDto(Account account)
        {
            return new AccountDto
            {
                AccountNumber = account.AccountNumber,
                FirstName = account.FirstName,
                MiddleName = account.MiddleName,
                LastName = account.LastName,
                Email = account.Email,
                Location = account.Location,
                PhoneNumber = account.PhoneNumber,
                AvailableBalance = account.AvailableBalance,
                Status = account.Status,
                RequirePinChange = account.RequirePinChange,
                FailedPinAttempts = account.FailedPinAttempts,
                LockoutEnd = account.LockoutEnd,
                LastFailedAttempt = account.LastFailedAttempt,
                CreatedDate = account.CreatedDate
            };
        }
    }
}
