"use client";

import { Create, useForm } from "@refinedev/antd";
import { Button, Form, Input } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          {/* <ScanNFCButton /> */}
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}

// function ScanNFCButton() {
//   const handleClick = async () => {
//     if ("NDEFReader" in window) {
//       try {
//         const ndef = new window.NDEFReader();
//         await ndef.scan();

//         console.log("Scan started successfully.");
//         ndef.onreadingerror = () => {
//           console.log("Cannot read data from the NFC tag. Try another one?");
//         };

//         ndef.onreading = (event: any) => {
//           console.log("NDEF message read.");
//         };
//       } catch (error) {
//         console.log(`Error! Scan failed to start: ${error}.`);
//       }
//     } else {
//       console.log("NDEFReader not supported.");
//     }
//   };
//   return <Button onClick={handleClick}>Scan NFC</Button>;
// }
