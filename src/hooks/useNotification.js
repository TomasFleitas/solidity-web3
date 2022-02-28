
import React from "react";
import { notification, Typography } from "antd";
import { WarningOutlined, CheckOutlined } from '@ant-design/icons';

const defaultNotificationProps = {
    duration: 5,
    placement: "topRight",
    style: { borderRadius: '10px', width: '355px' }
}

const { Text } = Typography;

/**
 * Notificaciones de ANTD con la configuración predeterminada usada en la app
 * @returns 
 */
const useNotification = () => {

    const openErrorNotification = (message = "Ocurrio un error al realizar la solicitud") => {
        notification.error({
            ...defaultNotificationProps,
            message: <Text style={{ color: 'white' }} >{message}</Text>,
            style: { ...defaultNotificationProps.style, backgroundColor: '#FF4D4D' },
            icon: <WarningOutlined style={{ color: 'white' }} />
        });
    };

    const openSuccessNotification = (message = "El incidente se ha actualizado exitosamente") => {
        notification.success({
            ...defaultNotificationProps,
            message: <Text style={{ color: 'white' }} >{message}</Text>,
            style: { ...defaultNotificationProps.style, backgroundColor: '#02BF80' },
            icon: <CheckOutlined style={{ color: 'white' }} />
        });
    };

    return { openErrorNotification, openSuccessNotification }

}

export { useNotification }