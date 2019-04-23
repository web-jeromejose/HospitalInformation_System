USE [HIS]
GO
/****** Object:  Table [OTEf].[UTIBundle]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [OTEf].[UTIBundle](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IssueAuthorityCode] [varchar](10) NULL,
	[RegistrationNo] [int] NOT NULL,
	[AdmissionNo] [int] NOT NULL,
	[AdmissionDate] [datetime] NULL,
	[IPID] [int] NULL,
	[Name] [varchar](500) NULL,
	[Age] [varchar](50) NULL,
	[CatheterInsertedDateTime] [datetime] NULL,
	[ByTrainedPerson] [bit] NULL,
	[ByTrainedPersonRemarks] [varchar](max) NULL,
	[CatheterIndication] [bit] NULL,
	[CatheterIndicationRemarks] [varchar](max) NULL,
	[HandHygiene] [bit] NULL,
	[HandHygieneRemarks] [varchar](max) NULL,
	[GlovesWorn] [bit] NULL,
	[GlovesWornRemarks] [varchar](max) NULL,
	[PatientCovered] [bit] NULL,
	[PatientCoveredRemarks] [varchar](max) NULL,
	[InsertionSiteCleaned] [bit] NULL,
	[InsertionSiteCleanedRemarks] [varchar](max) NULL,
	[SiteLubricated] [bit] NULL,
	[SiteLubricatedRemarks] [varchar](max) NULL,
	[AppropriateSize] [bit] NULL,
	[AppropriateSizeRemarks] [varchar](max) NULL,
	[ClosedSystem] [bit] NULL,
	[ClosedSystemRemarks] [varchar](max) NULL,
	[DrainageBagAttached] [bit] NULL,
	[DrainageBagAttachedRemarks] [varchar](max) NULL,
	[DrainageBagOffFloor] [bit] NULL,
	[DrainageBagOffFloorRemarks] [varchar](max) NULL,
	[CatheterSecured] [bit] NULL,
	[CatheterSecuredRemarks] [varchar](max) NULL,
	[TubingSecured] [bit] NULL,
	[TubingSecuredRemarks] [varchar](max) NULL,
	[Deleted] [bit] NOT NULL,
	[OperatorID] [int] NULL,
	[Saved] [datetime] NULL,
	[ModifiedOn] [datetime] NULL,
	[ModfiedOperator] [int] NULL,
 CONSTRAINT [PK_UTIBundle] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile] TEXTIMAGE_ON [MasterFile]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [OTEf].[UTIBundle] ON
INSERT [OTEf].[UTIBundle] ([ID], [IssueAuthorityCode], [RegistrationNo], [AdmissionNo], [AdmissionDate], [IPID], [Name], [Age], [CatheterInsertedDateTime], [ByTrainedPerson], [ByTrainedPersonRemarks], [CatheterIndication], [CatheterIndicationRemarks], [HandHygiene], [HandHygieneRemarks], [GlovesWorn], [GlovesWornRemarks], [PatientCovered], [PatientCoveredRemarks], [InsertionSiteCleaned], [InsertionSiteCleanedRemarks], [SiteLubricated], [SiteLubricatedRemarks], [AppropriateSize], [AppropriateSizeRemarks], [ClosedSystem], [ClosedSystemRemarks], [DrainageBagAttached], [DrainageBagAttachedRemarks], [DrainageBagOffFloor], [DrainageBagOffFloorRemarks], [CatheterSecured], [CatheterSecuredRemarks], [TubingSecured], [TubingSecuredRemarks], [Deleted], [OperatorID], [Saved], [ModifiedOn], [ModfiedOperator]) VALUES (1, N'SA01', 2787, 1, CAST(0x00009F0E00FAF80C AS DateTime), 110095, N'BASHIN WAFA  SALEM', N'29 Year(s)', CAST(0x0000A81400B6A5D0 AS DateTime), 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, 11503, CAST(0x0000A81400B4ADE5 AS DateTime), CAST(0x0000A81400B57C5F AS DateTime), 11503)
INSERT [OTEf].[UTIBundle] ([ID], [IssueAuthorityCode], [RegistrationNo], [AdmissionNo], [AdmissionDate], [IPID], [Name], [Age], [CatheterInsertedDateTime], [ByTrainedPerson], [ByTrainedPersonRemarks], [CatheterIndication], [CatheterIndicationRemarks], [HandHygiene], [HandHygieneRemarks], [GlovesWorn], [GlovesWornRemarks], [PatientCovered], [PatientCoveredRemarks], [InsertionSiteCleaned], [InsertionSiteCleanedRemarks], [SiteLubricated], [SiteLubricatedRemarks], [AppropriateSize], [AppropriateSizeRemarks], [ClosedSystem], [ClosedSystemRemarks], [DrainageBagAttached], [DrainageBagAttachedRemarks], [DrainageBagOffFloor], [DrainageBagOffFloorRemarks], [CatheterSecured], [CatheterSecuredRemarks], [TubingSecured], [TubingSecuredRemarks], [Deleted], [OperatorID], [Saved], [ModifiedOn], [ModfiedOperator]) VALUES (3, N'SA01', 2787, 1, CAST(0x00009F0E00FAF80C AS DateTime), 110095, N'BASHIN WAFA  SALEM', N'29 Year(s)', CAST(0x0000A81400B6A5D0 AS DateTime), 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, 11503, CAST(0x0000A81400B510E8 AS DateTime), CAST(0x0000A81400B57C5F AS DateTime), 11503)
INSERT [OTEf].[UTIBundle] ([ID], [IssueAuthorityCode], [RegistrationNo], [AdmissionNo], [AdmissionDate], [IPID], [Name], [Age], [CatheterInsertedDateTime], [ByTrainedPerson], [ByTrainedPersonRemarks], [CatheterIndication], [CatheterIndicationRemarks], [HandHygiene], [HandHygieneRemarks], [GlovesWorn], [GlovesWornRemarks], [PatientCovered], [PatientCoveredRemarks], [InsertionSiteCleaned], [InsertionSiteCleanedRemarks], [SiteLubricated], [SiteLubricatedRemarks], [AppropriateSize], [AppropriateSizeRemarks], [ClosedSystem], [ClosedSystemRemarks], [DrainageBagAttached], [DrainageBagAttachedRemarks], [DrainageBagOffFloor], [DrainageBagOffFloorRemarks], [CatheterSecured], [CatheterSecuredRemarks], [TubingSecured], [TubingSecuredRemarks], [Deleted], [OperatorID], [Saved], [ModifiedOn], [ModfiedOperator]) VALUES (4, N'SA01', 2787, 1, CAST(0x00009F0E00FAF80C AS DateTime), 110095, N'BASHIN WAFA  SALEM', N'29 Year(s)', CAST(0x0000A81400B6A5D0 AS DateTime), 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 0, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, N'Test', 1, 11503, CAST(0x0000A81400B545F0 AS DateTime), CAST(0x0000A81400B57C5F AS DateTime), 11503)
SET IDENTITY_INSERT [OTEf].[UTIBundle] OFF
/****** Object:  Table [OTEf].[OperativeReport_PreOPICDDiagnosis]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [OTEf].[OperativeReport_PreOPICDDiagnosis](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OperativeReportID] [int] NOT NULL,
	[ICDID] [int] NOT NULL,
	[Saved] [datetime] NULL,
	[OperatorID] [int] NULL,
	[Deleted] [bit] NULL,
 CONSTRAINT [PK_OperativeReport_ICDDiagnosis] PRIMARY KEY CLUSTERED 
(
	[OperativeReportID] ASC,
	[ICDID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile]
GO
SET IDENTITY_INSERT [OTEf].[OperativeReport_PreOPICDDiagnosis] ON
INSERT [OTEf].[OperativeReport_PreOPICDDiagnosis] ([ID], [OperativeReportID], [ICDID], [Saved], [OperatorID], [Deleted]) VALUES (1, 1, 42512, CAST(0x0000A81000DB9C2B AS DateTime), 11503, 1)
INSERT [OTEf].[OperativeReport_PreOPICDDiagnosis] ([ID], [OperativeReportID], [ICDID], [Saved], [OperatorID], [Deleted]) VALUES (2, 1, 42569, CAST(0x0000A81000F2F04E AS DateTime), 11503, 0)
SET IDENTITY_INSERT [OTEf].[OperativeReport_PreOPICDDiagnosis] OFF
/****** Object:  Table [OTEf].[OperativeReport_PostOPDiagnosis]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [OTEf].[OperativeReport_PostOPDiagnosis](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OperativeReportID] [int] NOT NULL,
	[ICDID] [int] NOT NULL,
	[Saved] [datetime] NULL,
	[OperatorID] [int] NULL,
	[Deleted] [bit] NULL,
 CONSTRAINT [PK_OperativeReport_PostOPDiagnosis] PRIMARY KEY CLUSTERED 
(
	[OperativeReportID] ASC,
	[ICDID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile]
GO
SET IDENTITY_INSERT [OTEf].[OperativeReport_PostOPDiagnosis] ON
INSERT [OTEf].[OperativeReport_PostOPDiagnosis] ([ID], [OperativeReportID], [ICDID], [Saved], [OperatorID], [Deleted]) VALUES (2, 1, 6659, CAST(0x0000A81000F2FB1B AS DateTime), 11503, 0)
INSERT [OTEf].[OperativeReport_PostOPDiagnosis] ([ID], [OperativeReportID], [ICDID], [Saved], [OperatorID], [Deleted]) VALUES (1, 1, 42512, CAST(0x0000A81000DBA48E AS DateTime), 11503, 1)
SET IDENTITY_INSERT [OTEf].[OperativeReport_PostOPDiagnosis] OFF
/****** Object:  Table [OTEf].[OperativeReport_PlannedProcedures]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [OTEf].[OperativeReport_PlannedProcedures](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OperativeReportID] [int] NOT NULL,
	[ProcedureID] [int] NOT NULL,
	[Saved] [datetime] NULL,
	[OperatorID] [int] NULL,
	[Deleted] [bit] NULL,
 CONSTRAINT [PK_OperativeReport_Procedures] PRIMARY KEY CLUSTERED 
(
	[OperativeReportID] ASC,
	[ProcedureID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile]
GO
SET IDENTITY_INSERT [OTEf].[OperativeReport_PlannedProcedures] ON
INSERT [OTEf].[OperativeReport_PlannedProcedures] ([ID], [OperativeReportID], [ProcedureID], [Saved], [OperatorID], [Deleted]) VALUES (1, 1, 2228, CAST(0x0000A81000DC1456 AS DateTime), 11503, 1)
INSERT [OTEf].[OperativeReport_PlannedProcedures] ([ID], [OperativeReportID], [ProcedureID], [Saved], [OperatorID], [Deleted]) VALUES (2, 1, 3112, CAST(0x0000A81000F30614 AS DateTime), 11503, 0)
SET IDENTITY_INSERT [OTEf].[OperativeReport_PlannedProcedures] OFF
/****** Object:  Table [OTEf].[OperativeReport_PerformedProcedures]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [OTEf].[OperativeReport_PerformedProcedures](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OperativeReportID] [int] NOT NULL,
	[ProcedureID] [int] NOT NULL,
	[Saved] [datetime] NULL,
	[OperatorID] [int] NULL,
	[Deleted] [bit] NULL,
 CONSTRAINT [PK_OperativeReport_PerformedProcedures] PRIMARY KEY CLUSTERED 
(
	[OperativeReportID] ASC,
	[ProcedureID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile]
GO
SET IDENTITY_INSERT [OTEf].[OperativeReport_PerformedProcedures] ON
INSERT [OTEf].[OperativeReport_PerformedProcedures] ([ID], [OperativeReportID], [ProcedureID], [Saved], [OperatorID], [Deleted]) VALUES (1, 1, 2182, CAST(0x0000A81000DC1AC9 AS DateTime), 11503, 1)
INSERT [OTEf].[OperativeReport_PerformedProcedures] ([ID], [OperativeReportID], [ProcedureID], [Saved], [OperatorID], [Deleted]) VALUES (2, 1, 3122, CAST(0x0000A81000F30BA6 AS DateTime), 11503, 0)
SET IDENTITY_INSERT [OTEf].[OperativeReport_PerformedProcedures] OFF
/****** Object:  Table [OTEf].[OperativeReport]    Script Date: 10/22/2017 11:13:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [OTEf].[OperativeReport](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IssueAuthorityCode] [varchar](10) NULL,
	[RegistrationNo] [int] NULL,
	[AdmissionNo] [int] NULL,
	[AdmissionDate] [datetime] NULL,
	[IPID] [int] NULL,
	[Name] [varchar](1000) NULL,
	[Age] [varchar](50) NULL,
	[Date] [datetime] NULL,
	[TypeOfAnesthesia] [varchar](50) NULL,
	[AnesthetistID] [int] NULL,
	[SurgeonID] [int] NULL,
	[SecondarySurgeonID] [int] NULL,
	[AsstSurgeonID] [int] NULL,
	[OperativeDetails] [varchar](max) NULL,
	[PeriOpertiveComplications] [varchar](max) NULL,
	[EstimatedAmountOfBloodLoss] [decimal](18, 2) NULL,
	[SurgicalSpecimenSentForExamination] [bit] NULL,
	[Saved] [datetime] NULL,
	[OperatorID] [int] NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedOperatorID] [int] NULL,
	[Deleted] [bit] NULL,
 CONSTRAINT [PK_OperativeReport] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [MasterFile]
) ON [MasterFile] TEXTIMAGE_ON [MasterFile]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [OTEf].[OperativeReport] ON
INSERT [OTEf].[OperativeReport] ([ID], [IssueAuthorityCode], [RegistrationNo], [AdmissionNo], [AdmissionDate], [IPID], [Name], [Age], [Date], [TypeOfAnesthesia], [AnesthetistID], [SurgeonID], [SecondarySurgeonID], [AsstSurgeonID], [OperativeDetails], [PeriOpertiveComplications], [EstimatedAmountOfBloodLoss], [SurgicalSpecimenSentForExamination], [Saved], [OperatorID], [ModifiedOn], [ModifiedOperatorID], [Deleted]) VALUES (1, N'SA01', 2787, 1, CAST(0x00009F0E00FAF80C AS DateTime), 110095, N'BASHIN WAFA  SALEM', N'29 Year(s)', CAST(0x00009F0E00FAC350 AS DateTime), N'test', 2411, 6122, 4398, 8909, N'testing', N'testing', CAST(12.00 AS Decimal(18, 2)), 1, CAST(0x0000A81000BE8A20 AS DateTime), 11503, CAST(0x0000A81000CA0D64 AS DateTime), 11503, 0)
SET IDENTITY_INSERT [OTEf].[OperativeReport] OFF
