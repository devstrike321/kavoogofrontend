import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "./Spinner";
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 10;

const PartnersList: React.FC = () => {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<any[]>([]);
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(role, userId);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admins/partners");
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (role == "partner") navigate(`/partners/${userId}`);
    else fetchPartners();
  }, []);

  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = partners.slice(start, start + ITEMS_PER_PAGE);
  
  return (
    <div>
      <h1>{t("partners")}</h1>
      {loading && <Spinner />}
      <button
        onClick={() => navigate("/add-partner")}
        className="primary"
        style={{ float: "right" }}
      >
        {t("addNewPartner", { defaultValue: "Add New Partner" })}
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>{t("partnerName", { defaultValue: "Partner Name" })}</th>
            <th>{t("country")}</th>
            <th>{t("status")}</th>
            <th>{t("lastCampaign")}</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((partner) => (
            <tr key={partner.id}>
              <td onClick={() => navigate(`/partners/${partner.id}`)}>
                {partner.partnerName}
              </td>
              <td>{partner.country}</td>
              <td>
                <span
                  className={`status-badge status-${partner.status.toLowerCase()}`}
                >
                  {t(partner.status.toLowerCase() || "noStatus")}
                </span>
              </td>
              <td>{t(partner.campaigns[0]?.name || "noCampaign")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages = {totalPages}
        currentPage = {currentPage}
        onPageChange = {setCurrentPage}
      />
    </div>
  );
};

export default PartnersList;
