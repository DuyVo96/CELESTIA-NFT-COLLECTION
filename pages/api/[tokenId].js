export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const image_url =
    "https://raw.githubusercontent.com/DuyVo96/CELESTIA-NFT-COLLECTION/main/public/CelestiaNft/";

  res.status(200).json({
    name: "Celestia NFT #" + tokenId,
    description:
      "Celestia NFT is a collection for all node runners of Celestia Network",
    image: image_url + tokenId + ".svg",
  });
}
