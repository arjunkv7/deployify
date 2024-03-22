import React from "react";

const NewProjectForm = ({
  handleDeploy,
  handleChange,
  isDeploying,
  isDeployed,
  uploadId
}) => {

  let domain = process.env.REACT_APP_WEBSITE_DOMAIN;
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Deploy New Project
        </h2>
      </div>

      <div
        class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        hidden={isDeployed ? true : false}
      >
        <form class="space-y-6" action="#" >
          <div>
            <label
              for="projectName"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Project Name
            </label>
            <input
              id="projectName"
              onChange={handleChange}
              name="projectName"
              type="text"
              autocomplete="Project Name"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-insetsm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <label
              for="repositoryUrl"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Git Hub Url
            </label>
            <input
              id="repositoryUrl"
              onChange={handleChange}
              name="repositoryUrl"
              type="text"
              autocomplete="repositoryUrl"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
            />
          </div>
          
            <button
              disabled={isDeploying}
              type="submit"
              onClick={handleDeploy}
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {" "}
              {isDeploying ? "Deploying..." : "Deploy"}
            </button>
          
          
        </form>
      </div>
      {isDeployed && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white text-center">
            <h2 className="text-lg font-bold">Deployed</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700 mb-2">Deployed URL:</p>
            <a
              href={`http://${uploadId}.${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-500 hover:bg-blue-400 text-center text-white font-semibold py-2 px-4 rounded-lg"
            >
             Visit Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProjectForm;
