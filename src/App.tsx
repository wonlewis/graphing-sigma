import './App.css'
import "@react-sigma/core/lib/react-sigma.min.css";
import {MultiDirectedTimeGraphView} from "./sigmaAssets/sigma_time_graph.tsx";
import {Gantt, Task } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import {TooltipProps} from "gantt-task-react/dist/components/other/tooltip";

function App() {
    const tasks: Task[] = [
        {
            start: new Date(2020, 1, 1),
            end: new Date(2020, 1, 2),
            name: 'Idea',
            id: 'Task 0',
            type:'task',
            progress: 45,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        }
    ];

    const customTooltipContent: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>  = () => {
        return (
            <div>
                <h1 style={{color: "red"}}>tfasfas</h1>
            </div>
        )
    }

  return (
    <>
        <MultiDirectedTimeGraphView/>
        <div style={{paddingTop: '100px'}}></div>
        <Gantt
            tasks={tasks}
            ganttHeight={100}
            TooltipContent={customTooltipContent}
        >
        </Gantt>
    </>
  )
}

export default App
