const path = require("path");
const fs = require("fs");

exports.ImageHandler = (image) => {
  const file = image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/all/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid image extension." });
  if (fileSize > 2000000)
    return res.status(422).json({ msg: "Image must be less than 2 MB" });

  file.mv(`./public/all/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
  });

  return {
    image: fileName,
    url: url,
  };
};
