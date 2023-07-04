import Box from "@mui/material/Box";

export interface StatisticsInfo {
    habitName: string;
    habitToDo: number;
    done: number;
    quit: number;
    lieOnDone: number;
    wantedToQuit: number;
    ignored: number;
}

export default function HabitInfo(props: StatisticsInfo) {
    return (
        <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>
            <h2>{props.habitName}</h2>
            <p>to do: {props.habitToDo}</p>
            <p>done: {props.done}</p>
            <p>quit: {props.quit}</p>
            <p>lieOnDone: {props.lieOnDone}</p>
            <p>wantedToQuit: {props.wantedToQuit}</p>
            <p>ignored: {props.ignored}</p>
        </Box>
    )
}