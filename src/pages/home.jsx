import { Button } from "@/components/ui/button"
import { Card, Card3, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import HomeImage from "../../public/Layer_1.svg"
import VectorSvg from '../../public/Layer_1_black.svg'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import React from "react"
import { Close } from "@radix-ui/react-dialog"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "auto",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  // border: 'none',
  borderRadius: '8px',

};

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const redirectToLogin = () =>{
    localStorage.removeItem("user-visited-dashboard");
    window.location.href = '/login'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white">
      <header className="  py-4 px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <img src={HomeImage} alt="NomicsAI Logo" className="object-contain" />
            </div>
            <span className="font-semibold manrope-font-bold">NomicsAI</span>
          </div>
          <div onClick={redirectToLogin}>

          <Button  variant="ghost" size="sm" className="text-black dark:text-white border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-700">
            API Status →
          </Button>
          </div>
        </div>
      </header>

      <section className="container py-12">
        <p className="mx-auto max-w-3xl text-center text-sm text-gray-600 dark:text-gray-300">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum, dolor 
        </p>
      </section>

      <section className="container py-4">
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="h-20 w-20 relative">
              <img
                src={HomeImage}
                className="h-full w-full block dark:hidden"
                alt="Light Mode Image"
              />
              <img
                src={VectorSvg}
                className="h-full w-full hidden dark:block"
                alt="Dark Mode Image"
              />
            </div>
            <h2 className="text-3xl manrope-font-bold ml-2 font-semibold">NomicsAI</h2>
          </div>
          <p className="text-gray-800 dark:text-gray-200 manrope-font-bold text-xl ">Your AI Edge in Every Trade</p>
        </div>
      </section>

      <section className="max-w-3xl p-2 w-full mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2">
            <Card3 className={`border cursor-pointer border-[#A0AEC0] dark:border-[#505050] bg-gray-50 dark:bg-[#101010] rounded-xl hover:shadow-lg hover:bg-gray-100 transition-all `} onClick={redirectToLogin}>
              <CardContent className="p-4 ">
                <h3 className="mb-2 font-bold text-lg">Start Now</h3>
                <p className="text-sm text-gray-400 dark:text-gray-400">Step into the future of trading with personal AI trading assistant.</p>
              </CardContent>
            </Card3>
            <Card3 className={`border border-[#A0AEC0] dark:border-[#505050] bg-gray-50 dark:bg-[#101010] rounded-xl hover:shadow-lg hover:bg-gray-100 transition-all hover:cursor-pointer`} onClick={handleOpen}>
              <CardContent className="p-4">
                <h3 className="mb-2 font-bold text-lg">Get NomicsAI App</h3>
                <p className="text-sm text-gray-400 dark:text-gray-400">Step into the future of trading – scan to start with your AI assistant on our app.</p>
              </CardContent>
            </Card3>
            <p></p>
        </div>
      </section>

      <section className="max-w-3xl w-full mx-auto py-12">
        <h2 className="mb-4 text-center md:text-3xl text-2xl font-bold text-black dark:text-white">Lorem ipsum is simply dummy</h2>
        <p className="mx-auto max-w-3xl text-center text-[16px] text-gray-600 dark:text-gray-300">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus omnis aperiam fugit exercitationem id, inventore repudiandae excepturi quasi praesentium suscipit!
        </p>
      </section>

      <section className="max-w-6xl w-full mx-auto overflow-x-auto py-8">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-black">
              {[...Array(7)].map((_, i) => (
                <TableHead key={i} className={`border px-4 py-2 font-bold  ${i === 2 ? "bg-[#E8E8E8] dark:bg-[#101010] dark:text-white" : ""} text-black dark:text-white text-center`}>Lorem ipsum</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-black"}>
                {Object.values(row).map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`border px-4 py-2 text-center text-black dark:text-white ${i === 2 ? "bg-[#E8E8E8] dark:bg-[#101010] dark:text-white" : ""}`}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
           <img src="/qr-code.png" width={"90%"} height={"90%"}/>
           <Button onClick={handleClose} className={"hover:cursor-pointer"}>Close</Button>
          </Box>
        </Fade>
      </Modal>

    </div>
  )
}

const tableData = [
  { name: "English", col1: "test", col2: "750.00", col3: "Lorem ipsum", col4: "Lorem", col5: "-", col6: "-" },
  { name: "Lorem ipsum is", col1: "0.18", col2: "750", col3: "21%", col4: "0.040", col5: "-", col6: "-" },
  { name: "Lorem ipsum", col1: "0.076", col2: "2.00", col3: "21%", col4: "0.055", col5: "-", col6: "-" },
  { name: "Lorem ipsum", col1: "65.2", col2: "60.0", col3: "52.3", col4: "54.8", col5: "50.2", col6: "37.2" },
  { name: "Lorem ipsum", col1: "48.0", col2: "45.2", col3: "47.6", col4: "73.2", col5: "74.8", col6: "72.4" },
  { name: "Lorem ipsum", col1: "49.0", col2: "40.2", col3: "41.7", col4: "54.7", col5: "40.2", col6: "39.1" },
  { name: "Lorem ipsum", col1: "90.7", col2: "60.0", col3: "61.1", col4: "54.2", col5: "56.3", col6: "54.1" },
  { name: "Lorem ipsum", col1: "24.8", col2: "27.2", col3: "31", col4: "17.1", col5: "29.4", col6: "26.8" },
  { name: "Lorem ipsum", col1: "74.5", col2: "70.4", col3: "69.8", col4: "60.0", col5: "70.8", col6: "68.1" },
  { name: "Lorem ipsum", col1: "45.7", col2: "35.4", col3: "28.8", col4: "30.7", col5: "41.0", col6: "44.1" },
]