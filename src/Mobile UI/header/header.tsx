
import img from "../../assets/vite.svg"
const Header = () => {
    return <>
        <div className="bg-amber-500  rounded-bl-4xl rounded-br-4xl pt-5 pb-10 px-4">
            <div className="flex justify-between p-2 mb-3">
                <div className="left h-12 w-12 rounded-full p-2 bg-white">
                    <img className="h-full w-full " src={img} alt="" />
                </div>

                <div className=" text-center text-white">
                    <h4 >Welcom to Joy delivery </h4>


                </div>

                <div className="right rounded-full bg-white w-10 h-10 flex justify-center items-center">
                    <h2 className="text-black font-bold text-center">m</h2>
                </div>
                
            </div>

            <div className="flex flex-col items-start justify-between ">
                <div className="div">
                    <h1 className="text-white text-4xl mt-6 font-bold">What do you want <br /> to eat touday</h1>
                </div>
                <div className="div mt-6 w-full">
                    <input type="search" name="" placeholder="search food" className="bg-white py-4 px-2 rounded-4xl w-[90%]"  id="" />
                </div>
            </div>
        </div>
    </>
}

export default Header