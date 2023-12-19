import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

export default function ClaimRewardsModal() {
  return (
    <div className="claim-rewards-modal-wrapper">
      <div className="claim-rewards-modal-overlay"></div>
      <div className="claim-rewards-modal">
        <div className="claim-rewards-modal-header">
        Your Rewards
        </div>
        <div className="claim-rewards-modal-content">
            <div className="claim-rewards-table">
                <div className="claim-rewards-table-header">
                    <div className="claim-rewards-table-header-item">
                        <p>Round</p>
                    </div>
                    <div className="claim-rewards-table-header-item">
                        <p>Amount</p>
                    </div>
                    <div className="claim-rewards-table-header-item">
                        <p>Rewards Available At</p>
                    </div>
                    <div className="claim-rewards-table-header-item">
                        <p>Claim</p>
                    </div>
                </div>
                <div className="claim-rewards-table-list">
                    <div></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
