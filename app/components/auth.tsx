import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import Locale from "../locales";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import LeftIcon from "@/app/icons/left.svg";

function TopBanner() {
  return (
    <>
      <div className={styles["auth-banner"]}>
        <div className={styles["auth-banner-inner"]}>
        </div>
      </div>
    </>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const goHome = () => navigate(Path.Home);

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    } else {
      // For internal system, automatically go to chat
      navigate(Path.Chat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <TopBanner></TopBanner>
      <div className={styles["auth-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Auth.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>
      <div className={styles["auth-logo"]}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>正在自动登录到内部系统...</div>

      <div className={styles["auth-actions"]}>
        <IconButton
          type="primary"
          text={Locale.Auth.Later}
          onClick={goHome}
        />
      </div>
    </div>
  );
}