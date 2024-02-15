import simpleGit from "simple-git";
import fs from 'fs';
import path from "path";

function cloneRepo(uniqueId: string, repoUrl: string) {
    return new Promise(async (resolve, reject) => {
        if (!repoUrl || repoUrl == '') return reject()

        // let uniqueId = await generateId();
        let git = simpleGit();
        let localpath = path.join(__dirname, `../output/${uniqueId}`);
        try {
            await git.clone(repoUrl, localpath);
            console.log('Repo cloned successfully');
            return resolve(uniqueId)
        } catch (error) {
            console.log(error);
            return reject(error)
        }
    })
}

export default cloneRepo;