CREATE DATABASE [OLAP_CLASSICMODELS]
USE [OLAP_CLASSICMODELS]
GO
/*Object:  Table [dbo].[CUSTOMERS]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CUSTOMERS](
	[CUSTOMERNUMBER] [int] NOT NULL,
	[CUSTOMERNAME] [varchar](50) NOT NULL,
	[NOMBRE_CONTACTO_CUSTOMER] [varchar](100) NOT NULL,
	[CITY] [varchar](50) NOT NULL,
	[COUNTRY] [varchar](50) NOT NULL,
 CONSTRAINT [PK_CUSTOMERS] PRIMARY KEY CLUSTERED 
(
	[CUSTOMERNUMBER] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/*Object:  Table [dbo].[EMPLOYEES]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EMPLOYEES](
	[EMPLOYEENUMBER] [int] NOT NULL,
	[NOMBRE_EMPLOYEE] [varchar](100) NOT NULL,
	[OFFICECODE] [varchar](10) NOT NULL,
 CONSTRAINT [PK_STAFFS] PRIMARY KEY CLUSTERED 
(
	[EMPLOYEENUMBER] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*Object:  Table [dbo].[PRODUCTLINES]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRODUCTLINES](
	[PRODUCTLINE] [varchar](50) NOT NULL,
	[TEXTDESCRIPTION] [varchar](4000) DEFAULT NULL,
 CONSTRAINT [PK_PRODUCTLINE] PRIMARY KEY CLUSTERED 
(
	[PRODUCTLINE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*Object:  Table [dbo].[PRODUCTS]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRODUCTS](
	[PRODUCTCODE] [varchar](15) NOT NULL,
	[PRODUCTNAME] [varchar](70) NOT NULL,
	[PRODUCTLINE] [varchar](50) NOT NULL,
	[QUANTITYINSTOCK] [smallint] NOT NULL,
 CONSTRAINT [PK_PRODUCTS] PRIMARY KEY CLUSTERED 
(
	[PRODUCTCODE] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*Object:  Table [dbo].[TBL_TIEMPO]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TBL_TIEMPO](
	[TIEMPO_ID] [date] NOT NULL,
	[NOMBRE_MES] [varchar](20) NULL,
	[SEMANA] [int] NULL,
	[TRIMESTRE] [int] NULL,
	[CUATRIMESTRE] [int] NULL,
	[SEMESTRE] [int] NULL,
	[DIA_DE_SEMANA] [varchar](20) NULL,
 CONSTRAINT [PK_TBLTIEMPO] PRIMARY KEY CLUSTERED 
(
	[TIEMPO_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*Object:  Table [dbo].[HECHOS_CLASSICMODELS]*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HECHOS_CLASSICMODELS](
	[CODIGO_ID] [int] IDENTITY(1,1) NOT NULL,
	[EMPLOYEENUMBER] [int] NOT NULL,
	[CUSTOMERNUMBER] [int] NOT NULL,
	[PRODUCTCODE] [varchar](15) NOT NULL,
	[PRODUCTLINE] [varchar](50) NOT NULL,
	[TIEMPO_ID] [date] NOT NULL,
	[TOTAL_VENTA_PRODUCTO] [float] NULL,
 CONSTRAINT [PK_HECHOS_CLASSICMODELS] PRIMARY KEY CLUSTERED 
(
	[CODIGO_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

/*Llaves foraneas*/
ALTER TABLE [dbo].[HECHOS_CLASSICMODELS]  WITH CHECK ADD FOREIGN KEY([CUSTOMERNUMBER])
REFERENCES [dbo].[CUSTOMERS] ([CUSTOMERNUMBER])
GO
ALTER TABLE [dbo].[HECHOS_CLASSICMODELS]  WITH CHECK ADD FOREIGN KEY([EMPLOYEENUMBER])
REFERENCES [dbo].[EMPLOYEES] ([EMPLOYEENUMBER])
GO
ALTER TABLE [dbo].[HECHOS_CLASSICMODELS]  WITH CHECK ADD FOREIGN KEY([PRODUCTCODE])
REFERENCES [dbo].[PRODUCTS] ([PRODUCTCODE])
GO
ALTER TABLE [dbo].[HECHOS_CLASSICMODELS]  WITH CHECK ADD FOREIGN KEY([TIEMPO_ID])
REFERENCES [dbo].[TBL_TIEMPO] ([TIEMPO_ID])
GO
ALTER TABLE [dbo].[PRODUCTS]  WITH CHECK ADD FOREIGN KEY([PRODUCTLINE])
REFERENCES [dbo].[PRODUCTLINES] ([PRODUCTLINE])
GO
USE [master]
GO
ALTER DATABASE [OLAP_CLASSICMODELS] SET  READ_WRITE 
GO
