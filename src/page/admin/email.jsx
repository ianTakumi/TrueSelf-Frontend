import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AxiosInstance from "../../../utils/AxiosInstance";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { notifyError, notifySuccess } from "../../../utils/helpers";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const Email = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const [files, setFiles] = useState([]);

  // This function will handle the form submission
  const onSubmit = async (data) => {
    console.log("Files being sent:", files);
    console.log(data);

    const formData = new FormData();
    formData.append("to", data.to);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    files.forEach((file) => {
      formData.append("attachments", file.file);
    });

    try {
      await AxiosInstance.post("/users/adminSendEmail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        if (response.status === 200) {
          notifySuccess("Success", response.data.message);
          reset();
          setFiles([]);
        }
      });
    } catch (error) {
      notifyError("Error", error.message);
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-5  p-6 bg-white rounded-lg shadow-xl">
      <h4 className="text-center text-3xl font-semibold text-gray-800 mb-8">
        Send Email
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[45%]">
            <label
              htmlFor="to"
              className="block text-sm font-medium text-gray-700"
            >
              To
            </label>
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="to"
                  type="email"
                  placeholder="Recipient email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />

            <span className="text-red-500 text-sm">{errors.to?.message}</span>
          </div>

          <div className="flex-1 min-w-[45%]">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="subject"
                  type="text"
                  placeholder="Subject"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
            <span className="text-red-500 text-sm">
              {errors.subject?.message}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="message"
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here"
              ></textarea>
            )}
          />

          <span className="text-red-500 text-sm">
            {errors.message?.message}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={5}
            name="files"
            labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
            allowFileEncode={true}
            acceptedFileTypes={["image/*", "application/pdf"]}
            className="mt-2"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default Email;
