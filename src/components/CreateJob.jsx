import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { addJobListing } from "../services/blockchain";
import { setGlobalState, truncate, useGlobalState } from "../store";

const CreateJob = () => {
  const [createModal] = useGlobalState("createModal");
  const [jobTitle, setJobTitle] = useState("");
  const [prize, setPrize] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkills = () => {
    if (skills.length != 5) {
      setSkills((prevState) => [...prevState, skill]);
    }
    setSkill("");
  };

  const removeSkill = (index) => {
    skills.splice(index, 1);
    setSkills(() => [...skills]);
  };

  const closeModal = () => {
    setGlobalState("createModal", "scale-0");
    setJobTitle("");
    setPrize("");
    setSkills([]);
    setSkill("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jobTitle == "" || prize == "" || skills.length < 3 || description == "")
      return;

    const params = {
      jobTitle,
      description,
      tags: skills.slice(0, 5).join(","),
      description,
      prize,
    };

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await addJobListing(params)
          .then(async (tx) => {
            closeModal();
            resolve(tx);
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "job added successfully 👌",
        error: "Encountered error 🤯",
      }
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="w-11/12 p-6 text-black bg-white shadow-md shadow-green-500 rounded-xl md:w-2/5 h-7/12">
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute bg-transparent border-0 focus:outline-none -top-2 -right-2"
          >
            <FaTimes />
          </button>
          <div>
            <h3 className="mb-8 text-xl">Create a Job</h3>
            <form className="" onSubmit={handleSubmit}>
              <div className="flex flex-col mb-5 space-y-1">
                <label htmlFor="jt">Job Title</label>
                <input
                  id="jt"
                  value={jobTitle}
                  placeholder="e.g. content writer..."
                  type="text"
                  className="text-sm rounded-md"
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col mb-5 space-y-1">
                <label htmlFor="desc">Prize</label>
                <input
                  id="number"
                  value={prize}
                  placeholder="eg. 0.04"
                  step={0.0001}
                  type="text"
                  className="text-sm rounded-md"
                  onChange={(e) => setPrize(e.target.value)}
                  required
                />
              </div>

              <div className="relative flex flex-col mb-1 space-y-1">
                <label htmlFor="desc">Featured skills</label>
                <input
                  id="text"
                  step={0.0001}
                  type="text"
                  value={skill}
                  className="text-sm rounded-md"
                  placeholder="Range (3 - 5) skills"
                  onChange={(e) => setSkill(e.target.value)}
                />
                {skills.length != 5 ? (
                  <span
                    className="cursor-pointer absolute top-[29px] right-1 py-1 px-4 bg-green-500 text-white text-sm rounded-md"
                    onClick={addSkills}
                  >
                    add
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center mt-2 mb-4 rounded-xl ">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center p-2 mt-2 mr-2 space-x-2 text-xs font-semibold text-gray-500 transition duration-300 bg-gray-200 rounded-full cursor-pointer w-max active:bg-gray-300 ease"
                  >
                    <span>{truncate(skill, 4, 4, 11)}</span>
                    <button
                      onClick={() => removeSkill(i)}
                      type="button"
                      className="bg-transparent hover focus:outline-none"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col mb-5 space-y-1">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  value={description}
                  type="text"
                  placeholder="write something beautiful..."
                  className="text-sm rounded-b-md focus:outline-none focus:ring-0"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  className="py-2 text-white bg-green-500 rounded-md px-9"
                  onClick={handleSubmit}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
