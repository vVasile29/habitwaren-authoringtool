import Box from "@mui/material/Box";
import {DateData} from "./App.tsx";
import {Table, TableBody, TableCell, TableRow} from "@mui/material";

interface UserListingItemProps {
    name: string;
    dateData: DateData[];
}

export default function UserListingItem(props: UserListingItemProps) {
    const name = props.name;
    const dateData = props.dateData;

    const groupFilteredUserHabitData = dateData.flatMap(data =>
        data.userHabitData.filter(uHabitData => uHabitData.userName === name)
    );

    const habitDoneData = groupFilteredUserHabitData.flatMap(value => value.habitDoneData);

    const waterDoneData = habitDoneData.filter(doneData => doneData.habitName === "water").flatMap(doneData => doneData.habitDoneDataInfo);
    const squatsDoneData = habitDoneData.filter(doneData => doneData.habitName === "squats").flatMap(doneData => doneData.habitDoneDataInfo);
    const meditationDoneData = habitDoneData.filter(doneData => doneData.habitName === "meditation").flatMap(doneData => doneData.habitDoneDataInfo);

    const waterDone = waterDoneData.reduce((total, dataInfo) => dataInfo.done ? total + 1 : total, 0)
    const waterQuit = waterDoneData.reduce((total, dataInfo) => !dataInfo.done ? total + 1 : total, 0)
    const waterLieOnDone = waterDoneData.reduce((total, dataInfo) => dataInfo.lieOnDone ? total + 1 : total, 0)
    const waterWantedToQuit = waterDoneData.reduce((total, dataInfo) => dataInfo.wantedToQuit ? total + 1 : total, 0)

    const squatsDone = squatsDoneData.reduce((total, dataInfo) => dataInfo.done ? total + 1 : total, 0);
    const squatsQuit = squatsDoneData.reduce((total, dataInfo) => !dataInfo.done ? total + 1 : total, 0);
    const squatsLieOnDone = squatsDoneData.reduce((total, dataInfo) => dataInfo.lieOnDone ? total + 1 : total, 0);
    const squatsWantedToQuit = squatsDoneData.reduce((total, dataInfo) => dataInfo.wantedToQuit ? total + 1 : total, 0);

    const meditationDone = meditationDoneData.reduce((total, dataInfo) => dataInfo.done ? total + 1 : total, 0);
    const meditationQuit = meditationDoneData.reduce((total, dataInfo) => !dataInfo.done ? total + 1 : total, 0);
    const meditationLieOnDone = meditationDoneData.reduce((total, dataInfo) => dataInfo.lieOnDone ? total + 1 : total, 0);
    const meditationWantedToQuit = meditationDoneData.reduce((total, dataInfo) => dataInfo.wantedToQuit ? total + 1 : total, 0);

    return (
        <Box sx={{ my: 5 }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>{name}</TableCell>

                        <TableCell>waterDone</TableCell>
                        <TableCell>{waterDone}</TableCell>

                        <TableCell>waterQuit</TableCell>
                        <TableCell>{waterQuit}</TableCell>

                        <TableCell>waterLieOnDone</TableCell>
                        <TableCell>{waterLieOnDone}</TableCell>

                        <TableCell>waterWantedToQuit</TableCell>
                        <TableCell>{waterWantedToQuit}</TableCell>

                        <TableCell>squatsDone</TableCell>
                        <TableCell>{squatsDone}</TableCell>

                        <TableCell>squatsQuit</TableCell>
                        <TableCell>{squatsQuit}</TableCell>

                        <TableCell>squatsLieOnDone</TableCell>
                        <TableCell>{squatsLieOnDone}</TableCell>

                        <TableCell>squatsWantedToQuit</TableCell>
                        <TableCell>{squatsWantedToQuit}</TableCell>

                        <TableCell>meditationDone</TableCell>
                        <TableCell>{meditationDone}</TableCell>

                        <TableCell>meditationQuit</TableCell>
                        <TableCell>{meditationQuit}</TableCell>

                        <TableCell>meditationLieOnDone</TableCell>
                        <TableCell>{meditationLieOnDone}</TableCell>

                        <TableCell>meditationWantedToQuit</TableCell>
                        <TableCell>{meditationWantedToQuit}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );

}