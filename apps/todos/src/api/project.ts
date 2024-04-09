import { Project } from '@/components/sidebar/sidebar-project/types';
import { db } from '@/config/firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

export const getAllProjectUser = (
  userId: string,
  cb: (project: Project[]) => void
) => {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));
  onSnapshot(q, (querySnapshot) => {
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({
        ...(doc.data() as Project),
        id: Number(doc.id),
      });
    });
    cb(projects);
  });
};

export const addProjectApi = async (project: Project) => {
  await setDoc(doc(db, 'projects', String(project.id)), {
    ...project,
  });
};

export const editProjectApi = async (project: Project) => {
  await updateDoc(doc(db, 'projects', String(project.id)), {
    ...project,
  });
};

export const deleteProjectApi = async (id: number) => {
  await deleteDoc(doc(db, 'projects', String(id)));
};

export const duplicateProjectApi = async (project: Project) => {
  const newProject = {
    ...project,
    id: Date.now(),
  };
  await setDoc(doc(db, 'projects', String(newProject.id)), {
    ...newProject,
  });
};
