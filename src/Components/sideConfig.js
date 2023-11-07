import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
export const NavConfig = [
  {
    name: "Dashboard",
    path: "/Dashboard",
    icon: <SpaceDashboardIcon color="white" />,
  },
  {
    name: "upload",
    path: "/Dashboard/upload",
    icon: <CloudUploadIcon color="white" />,
  },
  {
    name: "UserWise",
    path: "/Dashboard/userWiseChart",
    icon: <SupervisedUserCircleIcon color="white" />,
  },
];
