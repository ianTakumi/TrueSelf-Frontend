import React from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import { notifyError, notifySuccess, getUser } from "../../utils/helpers";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const CreatePost = () => {
  const user = getUser();
  const userId = user._id;

  return <div>CreatePost</div>;
};

export default CreatePost;
