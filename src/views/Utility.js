import React, { useEffect } from "react";
import CarouselComp from "../components/Utility/CarosolComp";
import Instruction from "../components/Utility/Instraction/PaymentMethod";
import PaymentMethodData from "../components/Utility/Instraction/PaymentMethodData";
import Popupbanner from "../components/Utility/PopupBanner/Popupbanner";
import StatusChange from "../components/Utility/statusChange";
import { userInfo } from '../utils/auth';
let superadmin = false;

const Utility = () => {

    const { role } = userInfo();

    if (role === 'superadmin') {
        superadmin = true
    }

    return (
        <>
            {superadmin && (
                <StatusChange />
            )}<br />
            <div>Banners</div>
            <CarouselComp />
            <div>Instruction</div>
            <Instruction />
            <PaymentMethodData />
            <Popupbanner />
        </>
    )
}

export default Utility