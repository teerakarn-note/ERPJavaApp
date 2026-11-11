"use client";

import { useEffect, useState } from "react";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { ProductionLogInterface } from "@/app/interface/ProductionLoginterface";
import { useParams } from "next/navigation";
import { Config } from "@/app/Config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/erp/components/Modal";

export default function ProdcutionLog() {
  const [production, setProduction] = useState<ProductionInterface | null>(
    null,
  );

  //เก็บเป็น array
  const [productionLogs, setProductionLogs] = useState<
    ProductionLogInterface[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [qty, setQty] = useState(0);
  const [createAt, setCreateAt] = useState(new Date());
  const [productionLogId, setProductionLogId] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fecthProduction();
    fecthProductionLogs();
  }, []);
  const fecthProductionLogs = async () => {
    const url = Config.apiUrl + "/api/production-logs/" + id;

    try {
      const response = await axios.get(url);

      if (response.status == 200) {
        setProductionLogs(response.data);
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };
  const fecthProduction = async () => {
    const url = Config.apiUrl + "/api/productions/" + id;
    try {
      const response = await axios.get(url);
      if (response.status == 200) {
        setProduction(response.data);
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    let url = Config.apiUrl + "/api/production-logs";

    try {
      const payload = {
        createAt: createAt.toISOString(),
        qty: qty,
        remark: remark,
        production: {
          id: id,
        },
      };
      let status;

      if (productionLogId > 0) {
        const response = await axios.put(url + "/" + productionLogId, payload);
        status = response.status;
        setProductionLogId(0);
      } else {
        const response = await axios.post(url, payload);
        status = response.status;
      }

      if (status == 200) {
        closeModal();
        fecthProductionLogs();
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบข้อมูลนี้หรือไม่",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (confirm.isConfirmed) {
      const url = Config.apiUrl + "/api/production-logs/" + id;
      try {
        const response = await axios.delete(url);

        if (response.status == 200) {
          fecthProductionLogs();
        }
      } catch (error: any) {
        Swal.fire({
          title: "error",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  const handleEdit = (ProductionLog : ProductionLogInterface) => {
    setShowModal(true);
    setCreateAt(new Date(ProductionLog.createAt));
    setQty(ProductionLog.qty);
    setRemark(ProductionLog.remark);
    setProductionLogId(ProductionLog.id);

  }
  return (
  <div>
    <h1> บันทึกการผลิตของสินค้า : {production?.name}</h1>
    <div className="flex flex-col mt-3 gap-3">
        <div>
            <button className="button-add" onClick={openModal}>
                <i className="fa-solid fa-plus mr-2"></i>
                เพิ่มข้อมูล
            </button>
        </div>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th style={{textAlign: 'right'}}>จำนวน</th>
                        <th >หมายเหตุ</th>
                        <th className="w-[120px]"></th>
                    </tr>
                </thead>
                <tbody>
                  {productionLogs.map((productionLog) =>(
                    <tr key = {productionLog.id}>
                        <td>{new Date(productionLog.createAt).toLocaleDateString()}</td>
                        <td className="text-right">{productionLog.qty}</td>
                        <td >{productionLog.remark}</td>
                        <td className="flex gap-2 justify-center">
                          <button onClick={()=> handleEdit(productionLog)} 
                            className="table-edit-btn table-action-btn">
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button onClick={()=>handleDelete(productionLog.id)}
                              className="table-delete-btn table-action-btn">
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>
    {showModal && (
      <Modal title="บันทึกการผลิต" onClose={closeModal}  >
        <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="">วันที่</label>
              <input type="data" value={createAt.toISOString().split('T')[0]}
                onChange={(e) => setCreateAt(new Date(e.target.value)) } />
            </div>
            <div>
              <label htmlFor="">จำนวน</label>
              <input type="text" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="">หมายเหตุ</label>
              <input type="text"  value={remark} onChange={(e) => setRemark(e.target.value)}/>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="modal-btn modal-btn-cancel">
                <i className="fas fa-time mr-2"></i>ยกเลิก
              </button>
              <button type="submit" onClick={handleSave} className="modal-btn modal-btn-submit">
                <i className="fas fa-check mr-2"></i>บันทึก
              </button>
            </div>
        </div>
      </Modal>
    )}
</div>
  )
}
