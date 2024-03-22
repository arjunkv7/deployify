
import React from 'react';

const ProjectTable = ({ projects }) => {
  let domain = process.env.REACT_APP_WEBSITE_DOMAIN;
  console.log(`${projects[0]?.uniqueId}.${domain}`)
  return (
    <div className="max-w-screen-lg mx-auto mt-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse">
          <thead className="text-xs bg-gray-50 dark:bg-white dark:text-gray-700">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-300">Project Name</th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-300">Status</th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-300">URL</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50 dark:bg-gray-100'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 dark:border-gray-300">
                  {project.projectName}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-300">{project.status}</td>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-300">
                  <a
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    href={`http://${project.uniqueId}.${domain}`}
                    target="_blank"
                    rel=""
                  >
                    {`${project.uniqueId}.${domain}`}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
