
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import React, {
    useState,
    useEffect,
} from "react";
import { Api } from '@/services/service';

function MainHeader({ toaster, loader }) {
    const router = useRouter();
    const { t } = useTranslation()
    const [carouselImg, setCarouselImg] = useState([]);

    useEffect(() => {
        getsetting();
    }, []);

    const getsetting = async () => {
        loader(true);
        Api("get", "getsetting", "", router).then(
            (res) => {
                loader(false);
                console.log("res================>", res);
                if (res?.success) {
                    if (res?.setting.length > 0) {
                        setCarouselImg(res?.setting[0]?.carousel);
                    }

                } else {
                    loader(false);
                    console.log(res?.data?.message);
                    toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                loader(false);
                console.log(err);
                toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <>
            {carouselImg?.length > 0 ?
                (
                    <div className="w-screen">
                        {carouselImg?.[0] && (
                            <div className="w-full md:min-h-[280px]  sm:h-full md:h-[70vh] lg:h-[85vh] xl:h-screen">
                                <img
                                    src={carouselImg[0]?.image || '/fallback.jpg'}
                                    alt="Carousel"
                                    className="w-full md:h-full 
                   object-contain 
                   sm:object-contain 
                   md:object-cover 
                   lg:object-cover 
                   xl:object-cover"
                                />
                            </div>
                        )}
                    </div>




                ) :
                (<div className="bg-[url('/image98.png')]  bg-cover bg-no-repeat md:h-[620px] md:p-0 ">
                    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5 max-w-7xl mx-auto h-full px-4 md:px-20 lg:px-32 xl:px-20 2xl:px-5">
                        <div className="flex flex-col justify-center items-center md:items-start py-10 md:py-0">
                            <p className="text-white mb-4 mt-6 md:mt-0 md:mb-12 font-semibold text-[13px] md:text-[15px] text-center md:text-start">
                                <span className="text-white font-semibold">100%</span> {t("Organic Fruits")}
                            </p>
                            <h1 className="text-center md:text-start text-2xl md:text-4xl lg:text-[44px]  xl:text-[55px] font-bold text-custom-purple leading-tight md:leading-[60px] text-white w-full">
                                {t("Explore fresh")} <br /> {t("juicy Fruits")}.
                            </h1>
                            <p className="text-white text-center md:text-start font-medium text-[13px] md:text-[15px] mt-4 italic md:mt-12 max-w-md w-[90%]">

                                {t("From garden-fresh fruits and crisp vegetables to dairy, snacks, and daily household needs — everything you need, all in one place. Easy pickup. Guaranteed freshness")}.
                            </p>
                            <button className="flex justify-center md:justify-start bg-custom-gold text-white px-6 py-3 rounded-lg text-[13px] md:text-[15px] mt-6 md:mt-12 items-center"
                                onClick={() => router.push("/categories/all")}
                            >
                                {t("Shop Now")}
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </>
    );
}

export default MainHeader;