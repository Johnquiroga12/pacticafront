// pages/tasks/index.tsx
import TaskPage from '../../components/TaskPage';
import { Task } from '../../utils/api';

const TaskPageWrapper = () => {
  return <TaskPage onCreateTask={function (task: Omit<Task, 'id'>): void {
    throw new Error('Function not implemented.');
  } } />;
};

export default TaskPageWrapper;
