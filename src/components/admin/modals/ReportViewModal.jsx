import React from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ReportViewModal({ onClose, report }) {
  if (!report) return null;

  const { reportType, reason, details, status, reportedItem, reporter } =
    report;

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Report Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Type:</strong> {reportType}
        </Typography>
        <Typography variant="body1">
          <strong>Reported By:</strong> {reporter.name}
        </Typography>

        <Typography variant="body1">
          <strong>Reason:</strong> {reason}
        </Typography>
        <Typography variant="body1">
          <strong>Details:</strong> {details}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {status}
        </Typography>
        <hr style={{ margin: "16px 0" }} />

        <Typography variant="h6">Reported {reportType}</Typography>
        {reportedItem ? (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            {/* Handling Reported Posts */}
            {reportType === "Post" && (
              <>
                <Typography variant="subtitle1">
                  <strong>Title:</strong> {reportedItem.title}
                </Typography>

                {reportedItem.type === "text" && (
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{ __html: reportedItem.content }}
                  />
                )}

                {reportedItem.type === "video" && reportedItem.video?.url && (
                  <video controls width="100%">
                    <source src={reportedItem.video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}

                {reportedItem.type === "image" &&
                  reportedItem.images?.length > 0 && (
                    <Grid container spacing={1}>
                      {reportedItem.images.map((img, index) => (
                        <Grid item xs={4} key={index}>
                          <img
                            src={img.url}
                            alt={`Image ${index + 1}`}
                            style={{ width: "100%", borderRadius: "4px" }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
              </>
            )}

            {/* Handling Reported Comments */}
            {reportType === "Comment" && (
              <>
                <Typography variant="subtitle1">
                  <strong>Comment by:</strong> {reportedItem.user.name}
                </Typography>

                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  "{reportedItem.content}"
                </Typography>
              </>
            )}
          </div>
        ) : (
          <Typography color="textSecondary">No reported item found.</Typography>
        )}

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Close
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
