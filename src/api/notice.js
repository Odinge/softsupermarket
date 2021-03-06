import axios from "axios";

// 发布公告
export const publish = params =>
  axios.post("/v1/nonpub/examine/addAnnouncement", params);

//根据用户信息获取studenId
export const getStudenId = () =>
  axios.get("/v1/nonpub/publish/getStudentIdByRequest");

//根据studentId获取userId
export const getUserId = studentId =>
  axios.get("/v1/nonpub/supervise/getUserId", {
    params: { studentId: studentId }
  });

//获取公告列表
export const noticeList = () =>
  axios.get("/v1/nonpub/examine/get/Announcements");

//查看公告详情
export const noticeDetail = announcementId =>
  axios.get("/v1/nonpub/examine/getAnnouncement", {
    params: { announcementId: announcementId }
  });

//删除公告接口
export const deleteNotice = announcementId =>
  axios.get("/v1/nonpub/examine/deleteAnnouncement", {
    params: { announcementId: announcementId }
  });

//彻底删除公告
export const realDelete = announcementId =>
  axios.get("/v1/nonpub/examine/realDelete", {
    params: { announcementId: announcementId }
  });

//恢复删除了的公告
export const recoverNotice = announcementId =>
  axios.get("/v1/nonpub/examine/reduction", {
    params: { announcementId: announcementId }
  });

//获取公告回收站
export const dustbin = () =>
  axios.get("/v1/nonpub/examine/get/forwardAnnouncements");

//上传图片接口
export const uploadImg = file =>
  axios.post("/v1/nonpub/examine/uploadAnnouncementImg", file);
