const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}Starting corp8_task build process...${colors.reset}\n`);

try {
  // Log current directory
  console.log(`${colors.yellow}Current directory:${colors.reset}`, process.cwd());
  
  // Check if client directory exists
  if (!fs.existsSync('./client')) {
    console.error(`${colors.red}Client directory not found!${colors.reset}`);
    process.exit(1);
  }
  
  // Step 1: Install dependencies in client directory
  console.log(`${colors.yellow}Installing client dependencies...${colors.reset}`);
  try {
    execSync('cd client && npm install', { stdio: 'inherit' });
  } catch (installError) {
    console.error(`${colors.red}Failed to install client dependencies:${colors.reset}`, installError.message);
    // Try alternative approach
    try {
      console.log(`${colors.yellow}Trying alternative npm install approach...${colors.reset}`);
      execSync('npm install', { cwd: './client', stdio: 'inherit' });
    } catch (altInstallError) {
      console.error(`${colors.red}Alternative npm install also failed:${colors.reset}`, altInstallError.message);
      throw altInstallError;
    }
  }

  // Step 2: Build client
  console.log(`\n${colors.yellow}Building client...${colors.reset}`);
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
  } catch (buildError) {
    console.error(`${colors.red}Failed to build client:${colors.reset}`, buildError.message);
    
    // Let's also check if the client directory exists and what's in it
    try {
      console.log(`${colors.yellow}Checking client directory contents...${colors.reset}`);
      const clientFiles = fs.readdirSync('./client');
      console.log('Client directory files:', clientFiles);
      
      if (fs.existsSync('./client/package.json')) {
        console.log(`${colors.yellow}Found package.json in client directory${colors.reset}`);
        const pkg = JSON.parse(fs.readFileSync('./client/package.json', 'utf8'));
        console.log('Client scripts:', pkg.scripts);
      }
      
      if (fs.existsSync('./client/dist')) {
        console.log(`${colors.yellow}dist directory exists:${colors.reset}`);
        const distFiles = fs.readdirSync('./client/dist');
        console.log('Dist directory files:', distFiles);
      } else {
        console.log(`${colors.yellow}dist directory does not exist${colors.reset}`);
      }
    } catch (dirError) {
      console.error(`${colors.red}Error checking directory contents:${colors.reset}`, dirError.message);
    }
    throw buildError;
  }

  // Step 3: Check if client-dist directory exists in server
  const clientDistPath = path.join(__dirname, 'server', 'client-dist');
  console.log(`${colors.yellow}Checking client-dist path:${colors.reset}`, clientDistPath);
  
  // Create client-dist directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'server'))) {
    console.log(`${colors.yellow}Creating server directory${colors.reset}`);
    fs.mkdirSync(path.join(__dirname, 'server'), { recursive: true });
  }
  
  if (!fs.existsSync(clientDistPath)) {
    console.log(`${colors.yellow}Creating client-dist directory${colors.reset}`);
    fs.mkdirSync(clientDistPath, { recursive: true });
  }
  
  // Copy files from client/dist to server/client-dist
  console.log(`${colors.yellow}Copying built files to server/client-dist...${colors.reset}`);
  try {
    if (fs.existsSync('./client/dist') && fs.readdirSync('./client/dist').length > 0) {
      execSync('cp -r client/dist/* server/client-dist/', { stdio: 'inherit' });
      console.log(`${colors.green}Files copied successfully${colors.reset}`);
    } else {
      console.error(`${colors.red}No files found in client/dist to copy${colors.reset}`);
      // List what's in client/dist
      if (fs.existsSync('./client/dist')) {
        const distContents = fs.readdirSync('./client/dist');
        console.log('Contents of client/dist:', distContents);
      }
      throw new Error('No built files to copy');
    }
  } catch (copyError) {
    console.error(`${colors.red}Failed to copy files:${colors.reset}`, copyError.message);
    throw copyError;
  }

  if (fs.existsSync(clientDistPath) && fs.readdirSync(clientDistPath).length > 0) {
    console.log(`\n${colors.green}✓ Client build successful! Output directory: ${clientDistPath}${colors.reset}`);
    // List contents of client-dist
    try {
      console.log(`${colors.yellow}Contents of client-dist:${colors.reset}`);
      const clientDistFiles = fs.readdirSync(clientDistPath);
      console.log('Client-dist files:', clientDistFiles);
      for (const file of clientDistFiles) {
        const stat = fs.statSync(path.join(clientDistPath, file));
        console.log(`  ${file} (${stat.isDirectory() ? 'directory' : `${stat.size} bytes`})`);
      }
    } catch (listError) {
      console.error(`${colors.red}Error listing client-dist contents:${colors.reset}`, listError.message);
    }
  } else {
    console.error(`\n${colors.red}✗ Build failed! Client-dist directory is empty or not found at: ${clientDistPath}${colors.reset}`);
    // Check what's in the server directory
    try {
      console.log(`${colors.yellow}Contents of server directory:${colors.reset}`);
      const serverFiles = fs.readdirSync('./server');
      console.log('Server directory files:', serverFiles);
    } catch (serverDirError) {
      console.error(`${colors.red}Error listing server directory contents:${colors.reset}`, serverDirError.message);
    }
    process.exit(1);
  }

  console.log(`\n${colors.green}${colors.bright}✓ Build process completed successfully!${colors.reset}`);

} catch (error) {
  console.error(`\n${colors.red}${colors.bright}✗ Build failed with error:${colors.reset}\n`, error.message);
  process.exit(1);
}