# Backend Scripts

This folder contains utility and test scripts for development and debugging purposes.

## Available Scripts

### Database Check Scripts

- **checkData.js** - Check database contents including users and attendance records
  ```bash
  node scripts/checkData.js
  ```

- **checkUsers.js** - List all users in the database with their roles
  ```bash
  node scripts/checkUsers.js
  ```

- **checkSteveAccount.js** - Check specific employee account details
  ```bash
  node scripts/checkSteveAccount.js
  ```

### Authentication Test Scripts

- **debugLogin.js** - Simulate login flow for debugging
  ```bash
  node scripts/debugLogin.js
  ```

- **testLoginAPI.js** - Test login API endpoint directly
  ```bash
  node scripts/testLoginAPI.js
  ```

- **testMosinaLogin.js** - Test specific user account login
  ```bash
  node scripts/testMosinaLogin.js
  ```

### Utility Scripts

- **resetStevePassword.js** - Reset password for test account
  ```bash
  node scripts/resetStevePassword.js
  ```

## Notes

- All scripts require the backend `.env` file to be configured
- Scripts automatically connect to MongoDB and close the connection after execution
- These are development tools and should not be run in production
