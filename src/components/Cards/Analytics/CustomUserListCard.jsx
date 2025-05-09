import { Typography, Box, Paper, Stack, Tooltip } from "@mui/material";

const CustomTopList = ({
                           data,
                           title,
                           subtitle,
                           value1Key = "value1",
                           value2Key = "value2",
                           onRowClick,
                           getTooltipText, // nova funkcija prop
                       }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, py: 3, borderRadius: 2 , minWidth:400}}>
            <Box mb={2}>
                {title && (
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                )}
                {subtitle && (
                    <Typography variant="subtitle2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>

            <Stack spacing={2}>
                {data.map((item, index) => {
                    const tooltipText = getTooltipText?.(item);

                    const rowContent = (
                        <Box
                            key={index}
                            onClick={() => onRowClick?.(item)}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom:
                                    index !== data.length - 1 ? "1px solid #e0e0e0" : "none",
                                pb: 1,
                                cursor: onRowClick ? "pointer" : "default",
                                "&:hover": onRowClick ? { backgroundColor: "#f1f1f1" } : {},
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ minWidth: "20px" }}
                                >
                                    {index + 1}.
                                </Typography>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">
                                        {item.first_name} {item.last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.company_name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="body1">{item[value1Key]}</Typography>
                                {item[value2Key] !== undefined && (
                                    <Typography variant="body2" color="text.secondary">
                                        Out of {item[value2Key]}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );

                    return tooltipText ? (
                        <Tooltip title={tooltipText} arrow key={index}>
                            <Box>{rowContent}</Box>
                        </Tooltip>
                    ) : (
                        rowContent
                    );
                })}
            </Stack>
        </Paper>
    );
};

export default CustomTopList;


