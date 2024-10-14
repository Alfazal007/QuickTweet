import { PROFILEPICDELETED, PROFILEPICNOTFOUND, USERNOTFOUND } from "../../constants/ReturnTypes";
import { deleteFromCloudinary } from "../../helpers/Cloudinary";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/AsyncHandler";

const removeProfilePic = asyncHandler(async(req, res) => {
    if(!req.user) {
        return res.status(400).json(new ApiError(400, USERNOTFOUND, []));
    }
    if(!req.user.profilePic) {
        return res.status(400).json(new ApiError(400, PROFILEPICNOTFOUND, []));
    }
    const userProfilePic = req.user.profilePic;
    await deleteFromCloudinary(userProfilePic);
    return res.status(200).json(new ApiResponse(200, PROFILEPICDELETED, {}));
});


export {
    removeProfilePic
}
