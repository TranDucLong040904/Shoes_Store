import sizeService from "../service/sizeService";

const readSize = async (req, res) => {
  try {
    const data = await sizeService.getSizeShoes();
    return res.status(200).json({
      errCode: data.errCode,
      errMessage: data.errMessage,
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: "-1",
      errMessage: "OK",
      DT: "", //data
    });
  }
};

module.exports = {
  readSize: readSize,
};
