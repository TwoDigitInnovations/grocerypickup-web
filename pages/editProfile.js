import React, { useState, useEffect } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { Api } from '@/services/service';
import AddressInput from '@/components/addressInput';
import { useTranslation } from 'react-i18next';

const EditProfile = ({ loader, toaster }) => {
   const { t } = useTranslation()
    const [profileData, setProfileData] = useState({
        username: '',
        lastname: "",
        email: '',
        gender: '',
        country: '',
        number: '',
        address: '',
    });

    const [profilePassword, setProfilePassword] = useState({
        password: '',
        confirmPassword: '',
    });



    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        const userDetails = localStorage.getItem('userDetail');
        if (userDetails) {
            setUser(JSON.parse(userDetails));
            getProfileData();
        }
    }, []);

    const handleInputChange = (name, value) => {
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (name, value) => {
        setProfilePassword(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const getProfileData = () => {
        loader(true);
        const token = localStorage.getItem('token');

        if (!token) {
            toaster({ type: "error", message: "Authentication required" });
            loader(false);
            return;
        }

        Api("get", "getProfile", null)
            .then(res => {
                loader(false);
                if (res?.status) {
                    setProfileData(prev => ({
                        ...prev,
                        username: res.data.username || '',
                        email: res.data.email || '',
                        lastname: res.data.lastname || '',
                        gender: res.data.gender || '',
                        country: res.data.country || '',
                        number: res.data.number || '',
                        address: res.data.address || ''
                    }));
                } else {
                    toaster({ type: "error", message: res?.data?.message || "Failed to load profile" });
                }
            })
            .catch(err => {
                loader(false);
                toaster({ type: "error", message: err?.data?.message || "Failed to load profile" });
            });
    };


    const toggleEditMode = () => setIsEditing(!isEditing);


    const updateProfile = () => {
        loader(true);
        if (profileData.number.length !== 10) {
            loader(false);
            toaster({ type: "error", message: "Phone number must be exactly 10 digits." });
            return;
        }
        const payload = {
            ...profileData,
        };

        Api("post", "updateProfile", payload)
            .then(res => {
                loader(false);
                if (res?.status) {
                    toaster({ type: "success", message: "Profile updated successfully" });
                    if (res.data) {
                        const userDetail = JSON.parse(localStorage.getItem('userDetail') || '{}');
                        const updatedUser = { ...userDetail, ...res.data };
                        localStorage.setItem('userDetail', JSON.stringify(updatedUser));
                        setUser(updatedUser);
                    }
                    setIsEditing(false);
                } else {
                    toaster({ type: "error", message: res?.data?.message || "Failed to update profile" });
                }
            })
            .catch(err => {
                loader(false);
                toaster({ type: "error", message: err?.data?.message || "Failed to update profile" });
            });
    };


    const changePassword = () => {

        if (profilePassword.password !== profilePassword.confirmPassword) {
            toaster({ type: "error", message: "Passwords don't match" });
            return;
        }

        if (!profilePassword.password) {
            toaster({ type: "error", message: "Password cannot be empty" });
            return;
        }

        loader(true);
        const passwordData = {
            password: profilePassword.password,
            confirmPassword: profilePassword.confirmPassword
        };

        Api("post", "profile/changePassword", passwordData)
            .then(res => {
                loader(false);
                if (res?.status) {
                    toaster({ type: "success", message: "Password changed successfully" });
                    setProfilePassword({
                        password: '',
                        confirmPassword: '',
                    });
                } else {
                    toaster({ type: "error", message: res?.data?.message || "Failed to change password" });
                }
            })
            .catch(err => {
                loader(false);
                toaster({ type: "error", message: err?.data?.message || "Failed to change password" });
            });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
            {/* Header */}
            <div className="flex flex-col justify-center items-center mb-8">
                <h1 className="md:mt-0 mt-4 text-center text-3xl md:text-4xl font-semibold text-black">
                   {t("My")}  <span className="text-custom-green">{t("Profile")}</span>
                </h1>
                <p className="text-center text-base mt-2 max-w-xl text-black">
                    {t("Manage your account details, addresses all in one place")}.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden mb-3 sm:mb-0 sm:mr-4">
                        <img
                            alt="Profile picture"
                            src={user?.profileImage || "/avtar.jpg"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-semibold text-black">{user?.fullName || profileData.username || "User Name"}</h2>
                        <p className="text-gray-600">{user?.email || profileData.email || "user@example.com"}</p>
                    </div>
                    <button
                        className="mt-3 sm:mt-0 sm:ml-auto px-4 py-2 rounded bg-custom-green text-white hover:bg-gray-800 cursor-pointer transition"
                        onClick={isEditing ? updateProfile : toggleEditMode}
                    >
                        {isEditing ? t('Save') : t('Edit')}
                    </button>
                </div>

                {/* Profile Form */}
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Full Name")}</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={profileData.username}
                                    type='text'
                                    name="username"
                                    placeholder="Your Name"
                                    onChange={(e) => handleInputChange("username", e.target.value)}
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.username || t('Not provided')}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Last Name")}</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={profileData.lastname}
                                    type='text'
                                    name="lastname"
                                    placeholder="Your Name"
                                    onChange={(e) => handleInputChange("lastname", e.target.value)}
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.lastname || t('Not provided')}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Email")}</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={profileData.email}
                                    type='email'
                                    name="email"
                                    placeholder="Your Email"
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.email ||  t('Not provided')}
                                </div>
                            )}
                        </div>

                        {/* Gender Select with improved handler */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Gender")}</label>
                            {isEditing ? (
                                <select
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    name="gender"
                                    value={profileData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                >
                                    <option value="">{t("Select Gender")}</option>
                                    <option value="Male">{t("Male")}</option>
                                    <option value="Female">{t("Female")}</option>
                                </select>
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.gender ||  t('Not provided')}
                                </div>
                            )}
                        </div>

                        {/* Country Select with improved handler */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Country")}</label>
                            {isEditing ? (
                                <CountryDropdown
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={profileData.country}
                                    onChange={(val) => handleInputChange('country', val)}
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.country ||  t('Not provided')}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Shipping Address")}</label>
                            {isEditing ? (
                                <AddressInput
                                    setProfileData={setProfileData}
                                    profileData={profileData}
                                    value={profileData?.address}
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.address ||  t('Not provided')}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">{t("Mobile")}</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={profileData.number}
                                    type='text'
                                    name="number"
                                    placeholder="Your Mobile Number"
                                    onChange={(e) => handleInputChange("number", e.target.value)}
                                />
                            ) : (
                                <div className="text-black w-full p-2 border rounded bg-gray-50">
                                    {profileData.number || t('Not provided')}
                                </div>
                            )}
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4 text-black">{t("Change Password")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">{t("New Password")}</label>
                                    <input
                                        className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder={t("Enter New Password")}
                                        type="password"
                                        name="password"
                                        value={profilePassword.password}
                                        onChange={(e) => handlePasswordChange('password', e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">{t("Confirm Password")}</label>
                                    <input
                                        className="w-full p-2 border rounded text-black focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder={t("Confirm New Password")}
                                        type="password"
                                        name="confirmPassword"
                                        value={profilePassword.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-custom-green rounded-lg text-white px-4 py-2.5 hover:bg-gray-800 transition mt-4"
                                    onClick={changePassword}
                                >
                                    {t("Change Password")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;