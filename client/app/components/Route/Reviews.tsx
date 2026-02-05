
import Image from 'next/image';
import { styles } from "../../styles/styles";


type Props = {}

export const reviews = [
    {
        name: "Gene Bates",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        profession: "Student | Cambridge University",
        comment:
            "I recently joined this platform, and I must say it's been an incredible experience. The courses are well-structured, and the instructors are top-notch. Highly recommended!",
    },
    {
        name: "Verna Santos",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        profession: "Full Stack Developer | Quarter ltda",
        comment:
            "As a developer, I'm always looking for ways to upskill. This platform offers advanced courses that have helped me stay ahead in my career. The project-based learning approach is fantastic.",
    },
    {
        name: "Jay Henderson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        profession: "Computer Science Student",
        comment:
            "The community here is amazing. Whenever I'm stuck, I get help almost instantly. The collaborative environment makes learning so much more enjoyable.",
    },
];

const Reviews = (props: Props) => {
    return (
        <div className="w-[90%] 800px:w-[85%] m-auto">
            <div className="w-full 800px:flex items-center">
                <div className="800px:w-[50%] w-full">
                    <Image
                        src={"/assetes/business-img.png"}
                        alt="business"
                        width={700}
                        height={700}
                        className="w-full object-cover"
                    />
                </div>
                <div className="800px:w-[50%] w-full">
                    <h3 className={`${styles.title} 800px:!text-[40px]`}>
                        Our Students Are <span className="text-gradient">Our Strength</span>{" "}
                        <br /> See What They Say About Us
                    </h3>
                    <br />
                    <p className={styles.label}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                        voluptatum, quis, vero omnis nesciunt sit recusandae distinctio
                        reprehenderit enim, beatae alias.
                    </p>
                    <div className="grid grid-cols-1 gap-[25px] mt-10">
                        {reviews &&
                            reviews.map((i, index) => (
                                <div className="w-full h-max bg-[#2190ff2e] dark:bg-[#2190ff10] border border-[#00000028] dark:border-[#ffffff1d] p-3 rounded-lg shadow-inner shadow-[gray] dark:shadow-[bg-slate-700] backdrop-blur-[6px]" key={index}>
                                    <div className="w-full flex items-center justify-between w-full">
                                        <div className="flex z-0">
                                            <Image
                                                src={i.avatar}
                                                alt=""
                                                width={50}
                                                height={50}
                                                className="w-[50px] h-[50px] rounded-full object-cover"
                                            />
                                            <div className="800px:flex justify-between w-full hidden">
                                                <div className="pl-4">
                                                    <h5 className="text-[20px] text-black dark:text-white">
                                                        {i.name}
                                                    </h5>
                                                    <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
                                                        {i.profession}
                                                    </h6>
                                                </div>
                                            </div>
                                            {/* Mobile view for name/profession if needed */}
                                            <div className="800px:hidden justify-between w-full flex flex-col pl-4">
                                                <h5 className="text-[20px] text-black dark:text-white">
                                                    {i.name}
                                                </h5>
                                                <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
                                                    {i.profession}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="pt-2 px-2 font-Poppins text-black dark:text-white">
                                        {i.comment}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews
