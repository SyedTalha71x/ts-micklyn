import Sidebar from "@/components/ui/sidebar"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const SettingsLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [activeItem, setActiveItem] = useState("/settings/manage-wallet")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", checkIfMobile)
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    setActiveItem(location.pathname)
  }, [location])

  const handleOpenModal = (path) => {
    navigate(path)
    if (isMobile) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden h-[600px]">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64">
            <Sidebar 
              activeItem={activeItem} 
              setActiveItem={setActiveItem} 
              openModal={handleOpenModal} 
              isMobile={isMobile} 
            />
          </div>

          <main className={`flex-1 p-4 overflow-y-auto ${isMobile ? "hidden" : "block"}`}>
            <Outlet />
          </main>
        </div>

        {isMobile && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px] p-0 h-[80vh] overflow-auto">
              <div className="p-6  ">
               
              </div>
              <div className="p-4">
                <Outlet /> 
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default SettingsLayout