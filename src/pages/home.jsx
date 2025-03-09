import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import HomeImage from '../../public/Layer_1.svg'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className=" border-gray-100 py-4 px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <img 
                src={HomeImage}
                alt="NomicsAI Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-semibold manrope-font-bold">NomicsAI</span>
          </div>
          <Button variant="ghost" size="sm">
            API Status →
          </Button>
        </div>
      </header>

      <section className="container py-12">
        <p className="mx-auto max-w-3xl text-center text-sm text-gray-600">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy text of the
        </p>
      </section>

      <section className="container py-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 gap-3 flex h-20 w-20 items-center justify-center">
            <img 
              src={HomeImage}
              alt="NomicsAI Logo" 
            />
          <h2 className="text-3xl manrope-font-bold font-semibold">NomicsAI</h2>
          </div>
          <p className="text-gray-800 text-xl font-bold manrope-font-bold">Lorem ipsum is simply dummy</p>
        </div>
      </section>

      <section className="max-w-3xl w-full mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-gray-400 rounded-xl">
            <CardContent className="p-4">
              <h3 className="mb-2 font-medium manrope-font-bold text-lg">Lorem ipsum is simply dummy text</h3>
              <p className="text-sm text-gray-500">Lorem ipsum is simply</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-400 rounded-xl">
            <CardContent className="p-4">
              <h3 className="mb-2 font-medium manrope-font-bold text-lg">Lorem ipsum is simply dummy text</h3>
              <p className="text-sm text-gray-500">Lorem ipsum is simply</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-3xl w-full mx-auto py-12">
        <h2 className="mb-4 text-center text-3xl manrope-font-bold ">Lorem ipsum is simply dummy</h2>
        <p className="mx-auto max-w-3xl text-center text-sm text-gray-800">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy text of
          the lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum is simply dummy
        </p>
      </section>

      <section className="max-w-6xl w-full mx-auto overflow-x-auto py-8">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border px-4 py-2 font-bold text-black text-left">Lorem ipsum is</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem ipsum is</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem ipsum</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem ipsum</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem</TableHead>
              <TableHead className="border px-4 py-2 font-bold text-black text-center">Lorem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="border px-4 py-2">{row.name}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col1}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col2}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col3}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col4}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col5}</TableCell>
                <TableCell className="border px-4 py-2 text-center">{row.col6}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

const tableData = [
  { name: "English", col1: "test", col2: "750.00", col3: "Lorem ipsum", col4: "Lorem", col5: "53.0", col6: "44.1" },
  { name: "Lorem ipsum is", col1: "0.18", col2: "750", col3: "21%", col4: "0.040", col5: "50.2", col6: "37.2" },
  { name: "Lorem ipsum", col1: "0.076", col2: "2.00", col3: "21%", col4: "0.055", col5: "51.3", col6: "38.0" },
  { name: "Lorem ipsum", col1: "65.2", col2: "60.0", col3: "52.3", col4: "54.8", col5: "50.2", col6: "37.2" },
  { name: "Lorem ipsum", col1: "48.0", col2: "45.2", col3: "47.6", col4: "73.2", col5: "74.8", col6: "72.4" },
  { name: "Lorem ipsum", col1: "49.0", col2: "40.2", col3: "41.7", col4: "54.7", col5: "40.2", col6: "39.1" },
  { name: "Lorem ipsum", col1: "90.7", col2: "60.0", col3: "61.1", col4: "54.2", col5: "56.3", col6: "54.1" },
  { name: "Lorem ipsum", col1: "24.8", col2: "27.2", col3: "31", col4: "17.1", col5: "29.4", col6: "26.8" },
  { name: "Lorem ipsum", col1: "74.5", col2: "70.4", col3: "69.8", col4: "60.0", col5: "70.8", col6: "68.1" },
  { name: "Lorem ipsum", col1: "45.7", col2: "35.4", col3: "28.8", col4: "30.7", col5: "41.0", col6: "44.1" },
]
