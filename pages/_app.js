import { createContext, useState, useEffect } from "react";
import "@/styles/globals.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Loader from "@/components/loader";
import { useTranslation } from "react-i18next";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "../ni18n.config"

export const userContext = createContext();
export const openCartContext = createContext();
export const cartContext = createContext();
export const favoriteProductContext = createContext();
export const languageContext = createContext();

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser ] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [openCart, setOpenCart] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [Favorite, setFavorite] = useState([]);
  
  const [globallang, setgloballang] = useState('es');
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    if (router.route === "/") {
      router.replace("/");
    }
    getUserdetail();
  }, []);

  const getUserdetail = () => {
    const user = localStorage.getItem("userDetail");
    if (user) {
      setUser (JSON.parse(user));
    }

    const cart = localStorage.getItem("addCartDetail");
    if (cart) {
      setCartData(JSON.parse(cart));
    }

    const favorites = localStorage.getItem("favoriteProducts");
    if (favorites) {
      setFavorite(JSON.parse(favorites));
    }
  };

  useEffect(() => {
    const defaultLanguage = 'en';
    localStorage.setItem("LANGUAGE", defaultLanguage);
    i18n.changeLanguage(defaultLanguage);
    setgloballang(defaultLanguage);
  }, []);



  return (
    <div>
      <ToastContainer />
      <languageContext.Provider value={[globallang, setgloballang]}>
      <userContext.Provider value={[user, setUser ]}>
        <openCartContext.Provider value={[openCart, setOpenCart]}>
          <cartContext.Provider value={[cartData, setCartData]}>
            <favoriteProductContext.Provider value={[Favorite, setFavorite]}>
              <Layout loader={setOpen} constant={data} toaster={(t) => toast(t.message)}>
                {open && <Loader open={open} />}
                <Component
                  toaster={(t) => toast(t.message)}
                  {...pageProps}
                  loader={setOpen}
                  user={user}
                />
              </Layout>
            </favoriteProductContext.Provider>
          </cartContext.Provider>
        </openCartContext.Provider>
      </userContext.Provider>
      </languageContext.Provider>
    </div>
  );
}
export default appWithI18Next(App, ni18nConfig);