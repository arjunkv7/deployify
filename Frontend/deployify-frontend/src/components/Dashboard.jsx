import React from 'react';
import ProjectTable from '../components/ProjectTable';
import { Link } from 'react-router-dom';

const Dashboard = ({ projects }) => {
  return (
    <div className='font-medium'>
      <div className='text-center mt-10 text-2xl'>
        <h2>All Projects</h2>
      </div>
      <ProjectTable projects={projects} />
      <div className='text-center mt-8'>
        <Link to={"/deploy"} type="button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4  dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Add new project</Link>
      </div>
    </div>
  );
};

export default Dashboard;
