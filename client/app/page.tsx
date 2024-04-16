"use client"
import React, { useState, useEffect } from 'react';
import { IDialogInfo } from './models/dto/IDialogInfo';
import Connector from './utils/singnalR-connector';

// const DialogUpdateContainer = () => {
//   const [dialogUpdate, setDialogUpdate] = useState('');

//   useEffect(() => {
//     const handleDialogsUpdate = (dialogs: IDialogInfo[]) => {
//       // Обработка обновления диалогов
//       setDialogUpdate( `${JSON.stringify(dialogs, null, 2)}`);
//       console.log({dialogUpdate});
//     };

//     // Регистрируем функцию-обработчик через Connector.getInstance().setOnDialogsUpdateCallback
//     const connectorInstance = Connector();
//     connectorInstance.setOnDialogsUpdateCallback(handleDialogsUpdate);
//   }, []);

//   return (
//     dialogUpdate
//   );
// };

// export default DialogUpdateContainer;