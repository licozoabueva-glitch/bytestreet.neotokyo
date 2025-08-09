// Clean ethers NFT transfer helper
async function transferNFT(signer, contractAddr, tokenId, receiver) {
    const abi = ["function safeTransferFrom(address from, address to, uint256 tokenId) external"];
    const contract = new ethers.Contract(contractAddr, abi, signer);
    const sender = await signer.getAddress();
    const tx = await contract.safeTransferFrom(sender, receiver, tokenId);
    console.log(`Sent ${contractAddr} #${tokenId}, tx: ${tx.hash}`);
    await tx.wait();
}
