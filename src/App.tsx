import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import moment, {Moment} from 'moment';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import Box from '@mui/material/Box';
import {Autocomplete, Button, TextField} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";
import HabitInfo from "./HabitInfo.tsx";
import UserListingItem from "./UserListingItem.tsx";

const API = 'http://localhost:8080'

interface User {
    name: string;
    gender: string;
    age: number;
    profession: string;
    codeword: string;
    points: number;
    isDarkGroup: boolean;
}

export interface DateData {
    date: string;
    userHabitData: UserHabitData[];
}

export interface UserHabitData {
    userName: string;
    habitDoneData: HabitDoneData[];
}

interface HabitDoneData {
    habitName: string;
    habitDoneDataInfo: HabitDoneDataInfo[];
}

interface HabitDoneDataInfo {
    lieOnDone: boolean;
    done: boolean;
    wantedToQuit: boolean;
}


function App() {
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [dateData, setAllDateData] = useState<DateData[]>([])
    const [isDarkGroup, setIsDarkGroup] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Moment>(moment())
    const [selectedGender, setSelectedGender] = useState("All");
    const [showAllDates, setShowAllDates] = useState(false);

    const [waterTodo, setWaterTodo] = useState(0);
    const [squatsTodo, setSquatsTodo] = useState(0);
    const [meditationTodo, setMeditationTodo] = useState(0);

    const [waterDone, setWaterDone] = useState(0);
    const [squatsDone, setSquatsDone] = useState(0);
    const [meditationDone, setMeditationDone] = useState(0);

    const [waterQuit, setWaterQuit] = useState(0);
    const [squatsQuit, setSquatsQuit] = useState(0);
    const [meditationQuit, setMeditationQuit] = useState(0);

    const [waterLieOnDone, setWaterLieOnDone] = useState(0);
    const [squatsLieOnDone, setSquatsLieOnDone] = useState(0);
    const [meditationLieOnDone, setMeditationLieOnDone] = useState(0);

    const [waterWantedToQuit, setWaterWantedToQuit] = useState(0);
    const [squatsWantedToQuit, setSquatsWantedToQuit] = useState(0);
    const [meditationWantedToQuit, setMeditationWantedToQuit] = useState(0);

    const [waterIgnored, setWaterIgnored] = useState(0);
    const [squatsIgnored, setSquatsIgnored] = useState(0);
    const [meditationIgnored, setMeditationIgnored] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUsers();
                await getAllDateData();
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const isDateDisabled = (date: Moment) => {
        return date.isBefore(moment().date(2)) || date.isAfter(moment().date(9));
    };

    const getUsers = async () => {
        try {
            const userResponse = await axios.get<User[]>(`${API}/user/getAllUsers`);
            setAllUsers(userResponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllDateData = async () => {
        try {
            const dateDataResponse = await axios.get<DateData[]>(`${API}/dateData/getAllDateData`);
            setAllDateData(dateDataResponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    function getGroupSize(isDarkGroup: boolean, selectedGender: string) {
        const filteredUsersByGender = allUsers.filter(user => user.gender === selectedGender || selectedGender === "All");
        const darkGroup = filteredUsersByGender.filter(user => user.isDarkGroup);
        const lightGroup = filteredUsersByGender.filter(user => !user.isDarkGroup);

        return isDarkGroup ? darkGroup.length : lightGroup.length;
    }

    function handleChange(showAllDates: boolean, isDarkGroup: boolean, selectedDate: Moment, selectedGender: string) {
        if (showAllDates) {
            setInfoByGroupAllDates(getGroupSize(isDarkGroup, selectedGender), isDarkGroup, selectedGender)
        } else {
            setInfoByGroupAndDate(getGroupSize(isDarkGroup, selectedGender), selectedDate, isDarkGroup, selectedGender)
        }
        setFilteredUsers(allUsers.filter(user => user.gender === selectedGender || selectedGender === "All").filter(user => user.isDarkGroup === isDarkGroup));
    }

    function setInfoByGroupAndDate(groupSize: number, selectedDate: Moment, isDarkGroup: boolean, selectedGender: string) {
        const date = selectedDate.format("YYYY-MM-DD")
        const waterToDoAmount = 8 * groupSize;
        const squatsToDoAmount = 5 * groupSize;
        const meditationToDoAmount = 5 * groupSize;

        initializeSetters(waterToDoAmount, squatsToDoAmount, meditationToDoAmount);

        const dateDataOfDate = dateData.find(data => data.date === date);
        if (!dateDataOfDate) {
            console.log("early return in dateDataOfDate")
            return;
        }

        const groupFilteredUserHabitData = dateDataOfDate.userHabitData.filter(uHabitData => {
            const user = allUsers.find(u =>
                u.name === uHabitData.userName &&
                u.isDarkGroup === isDarkGroup &&
                (selectedGender === "All" || u.gender === selectedGender)
            );
            return user && uHabitData.userName === user.name;
        });

        setHabitInformation(groupFilteredUserHabitData, waterToDoAmount, squatsToDoAmount, meditationToDoAmount);

    }

    function setInfoByGroupAllDates(groupSize: number, isDarkGroup: boolean, selectedGender: string) {
        const waterToDoAmount = 8 * groupSize * 7;
        const squatsToDoAmount = 5 * groupSize * 7;
        const meditationToDoAmount = 5 * groupSize * 7;

        initializeSetters(waterToDoAmount, squatsToDoAmount, meditationToDoAmount);

        const groupFilteredUserHabitData = dateData.flatMap(data =>
            data.userHabitData.filter(uHabitData => {
                const user = allUsers.find(u =>
                    u.name === uHabitData.userName &&
                    u.isDarkGroup === isDarkGroup &&
                    (selectedGender === "All" || u.gender === selectedGender)
                );
                return user && uHabitData.userName === user.name;
            })
        );

        setHabitInformation(groupFilteredUserHabitData, waterToDoAmount, squatsToDoAmount, meditationToDoAmount);
    }

    function initializeSetters(waterToDoAmount: number, squatsToDoAmount: number, meditationToDoAmount: number) {
        setWaterTodo(waterToDoAmount)
        setWaterDone(0)
        setWaterQuit(0)
        setWaterLieOnDone(0)
        setWaterWantedToQuit(0)
        setWaterIgnored(waterToDoAmount)

        setSquatsTodo(squatsToDoAmount)
        setSquatsDone(0);
        setSquatsQuit(0);
        setSquatsLieOnDone(0);
        setSquatsWantedToQuit(0);
        setSquatsIgnored(squatsToDoAmount)

        setMeditationTodo(meditationToDoAmount)
        setMeditationDone(0);
        setMeditationQuit(0);
        setMeditationLieOnDone(0);
        setMeditationWantedToQuit(0);
        setMeditationIgnored(meditationToDoAmount)
    }

    function setHabitInformation(groupFilteredUserHabitData: UserHabitData[], waterToDoAmount: number, squatsToDoAmount: number, meditationToDoAmount: number) {
        if (!groupFilteredUserHabitData) {
            console.log("early return in groupFilteredUserHabitData")
            return;
        }

        const getFilteredHabitDoneData = (groupFilteredUserHabitData: UserHabitData[], habitName: string) => {
            const filteredData = groupFilteredUserHabitData.flatMap(userHabitData =>
                userHabitData.habitDoneData.filter(doneData => doneData.habitName === habitName)
            );

            return filteredData.flatMap(doneData => doneData.habitDoneDataInfo);
        };


        const waterDoneData = getFilteredHabitDoneData(groupFilteredUserHabitData, "water");
        const squatsDoneData = getFilteredHabitDoneData(groupFilteredUserHabitData, "squats");
        const meditationDoneData = getFilteredHabitDoneData(groupFilteredUserHabitData, "meditation");

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

        setWaterDone(waterDone)
        setWaterQuit(waterQuit)
        setWaterLieOnDone(waterLieOnDone)
        setWaterWantedToQuit(waterWantedToQuit)
        setWaterIgnored(waterToDoAmount - (waterDone + waterQuit))

        setSquatsDone(squatsDone);
        setSquatsQuit(squatsQuit);
        setSquatsLieOnDone(squatsLieOnDone);
        setSquatsWantedToQuit(squatsWantedToQuit);
        setSquatsIgnored(squatsToDoAmount - (squatsDone + squatsQuit))

        setMeditationDone(meditationDone);
        setMeditationQuit(meditationQuit);
        setMeditationLieOnDone(meditationLieOnDone);
        setMeditationWantedToQuit(meditationWantedToQuit);
        setMeditationIgnored(meditationToDoAmount - (meditationDone + meditationQuit))
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <h1>Habitwarden-Authoringtool</h1>
                <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                    <Autocomplete
                        value={isDarkGroup ? "dark" : "light"}
                        onChange={(_, group) => {
                            if (group !== null) {
                                setIsDarkGroup(group === "dark");
                                handleChange(showAllDates, group === "dark", selectedDate, selectedGender);
                            }
                        }}
                        disablePortal
                        options={["dark", "light"]}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="select group"/>}
                    />
                    <Autocomplete
                        value={selectedGender}
                        onChange={(_, gender) => {
                            if (gender) {
                                setSelectedGender(gender);
                                handleChange(showAllDates, isDarkGroup, selectedDate, gender);
                            }
                        }}
                        disablePortal
                        options={['All', 'M', 'W', 'D']}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Select gender"/>}
                    />
                    <DatePicker
                        sx={{width: 300}}
                        value={selectedDate}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(date)
                                handleChange(showAllDates, isDarkGroup, date, selectedGender);
                            }
                        }}
                        disabled={showAllDates}
                        shouldDisableDate={isDateDisabled}
                    />
                    <Button onClick={() => {
                        setShowAllDates(prevState => {
                            handleChange(!prevState, isDarkGroup, selectedDate, selectedGender)
                            return !prevState;
                        });
                    }}>Show All Dates</Button>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", width: "50%", gap: 1}}>
                    <HabitInfo
                        habitName={"water"}
                        habitToDo={waterTodo}
                        done={waterDone}
                        quit={waterQuit}
                        lieOnDone={waterLieOnDone}
                        wantedToQuit={waterWantedToQuit}
                        ignored={waterIgnored}
                    />
                    <HabitInfo
                        habitName={"squats"}
                        habitToDo={squatsTodo}
                        done={squatsDone}
                        quit={squatsQuit}
                        lieOnDone={squatsLieOnDone}
                        wantedToQuit={squatsWantedToQuit}
                        ignored={squatsIgnored}
                    />
                    <HabitInfo
                        habitName={"meditation"}
                        habitToDo={meditationTodo}
                        done={meditationDone}
                        quit={meditationQuit}
                        lieOnDone={meditationLieOnDone}
                        wantedToQuit={meditationWantedToQuit}
                        ignored={meditationIgnored}
                    />
                </Box>
                <Box>
                    {filteredUsers.map(user =>
                        <UserListingItem key={user.name}
                                         name={user.name}
                                         dateData={showAllDates ? dateData : dateData.filter(data => data.date === selectedDate.format("YYYY-MM-DD"))}
                        />
                    )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default App;
