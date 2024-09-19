import FormModal from "@/components/modals/formModal"
import { addCarPic } from "@/constants/requests/cars"
import { CarI, pictureTypes, PictureTypeT } from "@/interface/api/car"
import { useState } from "react"


const AddPicture = ({
    car,
    onSuccess
}: {
    car: CarI
    onSuccess: () => void
}) => {
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ picType, setPicType ] = useState<PictureTypeT>()
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null)

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPicType(e.target.value as PictureTypeT);
    }

    const handleAddPic = async (): Promise<boolean> => {
        if(selectedFile === null) {
            alert('Please provide an image of the vehicle')
            return false
        }
        if(!picType) {
            alert('Please provide the type of picture of the vehicle')
            return false
        }

        setLoading(true)
        const res = await addCarPic(
            car.id,
            selectedFile,
            picType
        )
        setLoading(false)
        if (res.isErr) return false
        onSuccess()

        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        /**5MB */
        const maxSize = 5 * 1024 * 1024

        if (!file) return; // If no file is selected, exit early

        // File type validation
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
            alert("Only JPEG and PNG files are allowed.");
            return;
        }

        // File size validation (size is in bytes, so 2MB = 2 * 1024 * 1024)
        if (file.size > maxSize) {
            alert("File size should not exceed 5MB.");
            return;
        }

        setSelectedFile(file)
    }

    return (
        <FormModal
            title="Add Picture"
            paramKey="add_picture"
            onOk={ handleAddPic }
            loading={ loading }
        >
            <div className="">
                <div>
                    <label htmlFor="pictureType" className="block font-bold mb-2">
                        Select Picture Type
                    </label>
                    <select
                        id="pictureType"
                        value={ picType }
                        onChange={ handleSelectChange }
                        className="border border-gray-300 p-2 rounded-md"
                    >
                        <option value="" disabled>Select a type</option>
                        {pictureTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedFile && (
                    <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover mb-3 rounded-md" 
                    />
                )}
                <input 
                    type="file" 
                    name="image" 
                    id="image" 
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                />
            </div>
        </FormModal>
    )
}

export default AddPicture