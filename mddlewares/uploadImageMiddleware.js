// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const apiError = require("../utils/apiError");

const multerStorage = () => {
  //Disk Storage engin
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  const storage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      // eslint-disable-next-line new-cap
      cb(new apiError("Only Image Allowed", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerStorage().single(fieldName);

exports.uploadMixImages = (arrayFilelds) =>
  multerStorage().fields(arrayFilelds);
