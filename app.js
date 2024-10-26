let contract;
const contractAddress = "0x28180f22bbdcf1a9f20460885e987976baa81a78"; // Replace with your actual contract address

// Elements for displaying game status and results
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");
const joinGameButton = document.getElementById("joinGameButton");

// Initialize the connection to MetaMask and load the ABI
async function init() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // Fetch the ABI from the external message.txt file
            const response = await fetch('message.txt');
            const contractABI = await response.json();  // Parse JSON data from the file
            console.log("Contract ABI loaded:", contractABI);

            // Initialize contract with ABI and address
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            statusDiv.innerText = "Connected to MetaMask! Click 'Join Game' to start.";
        } catch (error) {
            console.error("Error connecting to MetaMask or loading ABI:", error);
            statusDiv.innerText = "Failed to connect to MetaMask or load contract ABI.";
        }
    } else {
        alert("MetaMask is required to interact with this site. Please install MetaMask.");
        console.error("MetaMask not detected.");
    }
}

// Function to join or create a game (example interaction)
async function joinOrCreateGame() {
    if (!contract) {
        console.error("Contract is not initialized.");
        statusDiv.innerText = "Contract is not initialized. Please ensure MetaMask is connected.";
        return;
    }

    try {
        statusDiv.innerText = "Joining game...";
        const tx = await contract.joinOrCreateGame({ value: ethers.utils.parseEther("0.0007") });
        await tx.wait();
        statusDiv.innerText = "Waiting for a match...";
    } catch (error) {
        console.error("Failed to join game:", error);
        statusDiv.innerText = "Failed to join game. Check MetaMask for errors.";
    }
}

// Add click event to join button
joinGameButton.addEventListener("click", joinOrCreateGame);

// Initialize the dApp
init();
