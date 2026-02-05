"use client";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import avatarDefault from "../../../public/assetes/avatardefault.jpg";
import { styles } from "../../styles/styles";
import { useEffect, useState } from "react";
import { useEditProfileMutation, useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import toast from "react-hot-toast";
/* eslint-disable @typescript-eslint/no-explicit-any */
type ProfileInfoProps = {
    user: any;
    avatar: string | null;
}


const ProfileInfo = ({ user, avatar }: ProfileInfoProps) => {

    const [name, setName] = useState(user.name);
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: isEditSuccess, error: editError }] = useEditProfileMutation();
    const [loadUser, setLoadUser] = useState(false);
    const { } = useLoadUserQuery(undefined, { skip: loadUser ? false : true });


    const imageHandler = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileReader = new FileReader();

        fileReader.onload = () => {
            // FileReader readyState === 2 means DONE
            if (fileReader.readyState === 2) {
                updateAvatar({ avatar: fileReader.result });
            }
        };
        fileReader.readAsDataURL(file); // convert file → Base64
    };

    useEffect(() => {
        if (isSuccess || isEditSuccess) {
            setLoadUser(true);
            toast.success(isSuccess ? "Avatar updated successfully!" : "Profile updated successfully!");
        }
        if (error as any || editError as any) {
            console.log(error || editError);
        }
    }, [isSuccess, error, isEditSuccess, editError]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({ name, email: user.email });
        }
    };



    return (
        <>
            <div className="w-full flex justify-center">
                <div className="relative">
                    <Image
                        src={user.avatar || avatar ? user.avatar.url || avatar : avatarDefault}
                        alt="Profile Photo"
                        width={120}
                        height={120}
                        className="w-[120px] object-cover h-[120px] cursor-pointer border-[3px] border-[#30bbb2ca] rounded-full"
                    />
                    <input
                        type="file"
                        name=""
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                    <label htmlFor="avatar">
                        <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className="z-1" />
                        </div>
                    </label>
                </div>
            </div>
            <br />
            <br />

            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handleSubmit}>
                    <div className="800px:w-[50%] m-auto block pb-4">
                        <div className="w-[100%] dark:text-white text-black pt-2">
                            <label className="block" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="w-[100%] dark:text-white text-black pt-2">
                            <label className="block" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="text"
                                readOnly
                                id="email"
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                required
                                value={user && user.email}
                            />
                        </div>
                        <br />
                        <input
                            type="submit"
                            className="w-full 800px:w-[250px] h-[40px] border border-[cyan] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer"
                            required
                            value="Update"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProfileInfo;