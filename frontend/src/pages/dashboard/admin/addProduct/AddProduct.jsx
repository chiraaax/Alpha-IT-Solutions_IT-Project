import React, { useState, useContext } from "react";
import axios from "axios";
import UploadImage from "./UploadImage";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";

// Define the product types available for the admin to select
const productTypes = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'motherboard', label: 'Motherboard' },
    { value: 'processor', label: 'Processor' },
    { value: 'ram', label: 'RAM' },
    { value: 'gpu', label: 'GPU' },
    { value: 'powerSupply', label: 'Power Supply' },
    { value: 'casings', label: 'Casings' },
    { value: 'monitors', label: 'Monitors' },
    { value: 'cpuCoolers', label: 'CPU Coolers/AIO' },
    { value: 'keyboard', label: 'Keyboard' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'soundSystems', label: 'Sound Systems' },
    { value: 'cables&Connectors', label: 'Cables & Connectors' },
    { value: 'storage', label: 'Storage' },
    { value: 'externalStorage', label: 'External Storage' },
  ];
  
  const stateField = {
    name: 'state',
    label: 'State',
    type: 'select',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Used', value: 'used' },
      { label: 'Refurbished', value: 'refurbished' },
    ],
  };
  
  const productFields = {
    laptop: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 2790000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'laptopBrand', label: 'Laptop Brand', type: 'select', options: [
        { label: 'MSI', value: 'msi' },
        { label: 'ASUS', value: 'asus' },
        { label: 'Lenovo', value: 'lenovo' },
        { label: 'HP', value: 'hp' },
        { label: 'Acer', value: 'acer' },
      ] },
      { name: 'laptopCPU', label: 'Laptop CPU', type: 'select', options: [
        { label: 'Intel Core i7', value: 'intel core i7' },
        { label: 'AMD Ryzen 9', value: 'amd ryzen 9' },
        { label: 'Intel Core i5', value: 'intel core i5' },
        { label: 'Intel Core i5 14th gen', value: 'intel core i5 14th gen' },
        { label: 'Intel Core i3', value: 'intel core i3' },
        { label: 'AMD Ryzen 7', value: 'amd ryzen 7' },
        { label: 'Snapdragon X Plus X1P', value: 'snapdragon x plus x1p' },
        { label: 'Intel Core i9', value: 'intel core i9' },
        { label: 'Intel Ultra 9', value: 'intel ultra 9' },
        { label: 'Intel Ultra 7', value: 'intel ultra 7' },
        { label: 'AMD Ryzen 5', value: 'amd ryzen 5' },
        { label: 'Intel Ultra 5', value: 'intel ultra 5' },
        { label: 'Intel Core i3 14th gen', value: 'intel core i3 14th gen' },
        { label: 'Intel Core i7 14th gen', value: 'intel core i7 14th gen' },
        { label: 'Intel N100 / Celeron', value: 'intel n100 / celeron' },
        { label: 'Snapdragon X Elite X1E', value: 'snapdragon x elite x1e' },
      ] },
      { name: 'laptopGraphics', label: 'Laptop Graphics', type: 'select', options: [
        { label: 'RTX 4050 6GB', value: 'rtx 4050 6gb' },
        { label: 'AMD Radeon Graphics', value: 'amd radeon graphics' },
        { label: 'RTX 3050 4GB', value: 'rtx 3050 4gb' },
        { label: 'Intel Graphics', value: 'intel graphics' },
        { label: 'Qualcomm Adreno GPU', value: 'qualcomm adreno gpu' },
        { label: 'RTX 4060 8GB', value: 'rtx 4060 8gb' },
        { label: 'RTX 4070', value: 'rtx 4070' },
        { label: 'RTX 3050 6GB', value: 'rtx 3050 6gb' },
        { label: 'Intel Arc Graphics', value: 'intel arc graphics' },
        { label: 'RTX 4070 8GB', value: 'rtx 4070 8gb' },
        { label: 'RTX 2050 4GB', value: 'rtx 2050 4gb' },
        { label: 'TX 5080 16GB', value: 'tx 5080 16gb' },
        { label: 'BRTX 4090 16GB', value: 'brtx 4090 16gb' },
      ] },
      { name: 'laptopScreenSize', label: 'Laptop Screen Size', type: 'select', options: [
        { label: '15 inches', value: '15 inches' },
        { label: '14 inches', value: '14 inches' },
        { label: '16 inches', value: '16 inches' },
        { label: '17 inches', value: '17 inches' },
        { label: '18 inches', value: '18 inches' },
      ] },
    ],
    motherboard: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 2990000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'motherboardChipset', label: 'Motherboard Chipset', type: 'select', options: [
        { label: 'AMD A520', value: 'amd a520' },
        { label: 'AMD B550', value: 'amd b550' },
        { label: 'AMD B450', value: 'amd b450' },
        { label: 'AMD X670', value: 'amd x670' },
        { label: 'AMD B650', value: 'amd b650' },
        { label: 'Intel Z790', value: 'intel z790' },
        { label: 'Intel B760', value: 'intel b760' },
        { label: 'Intel H610', value: 'intel h610' },
        { label: 'Intel H510', value: 'intel h510' },
        { label: 'AMD A620', value: 'amd a620' },
        { label: 'Intel Z890', value: 'intel z890' },
        { label: 'AMD X870', value: 'amd x870' },
        { label: 'Intel B860', value: 'intel b860' },
        { label: 'AMD B840', value: 'amd b840' },
        { label: 'AMD B850', value: 'amd b850' },
      ] },
      { name: 'motherboardManufacturer', label: 'Motherboard Manufacturer', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'MSI', value: 'msi' },
        { label: 'Colorful', value: 'colorful' },
      ] },
      { name: 'socketType', label: 'Socket Type', type: 'select', options: [
        { label: 'AMD AM5', value: 'amd am5' },
        { label: 'Intel 1700 12th/13th/14th Gen', value: 'intel 1700 12th/13th/14th gen' },
        { label: 'AMD AM4', value: 'amd am4' },
        { label: 'Intel 1200 10th/11th Gen', value: 'intel 1200 10th/11th gen' },
        { label: 'Intel LGA1851 15th Gen', value: 'intel lga1851 15th gen' },
      ] },
    ],
    processor: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 2320000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'cpuManufacture', label: 'CPU Manufacture', type: 'select', options: [
        { label: 'AMD', value: 'amd' },
        { label: 'Intel', value: 'intel' },
      ] },
      { name: 'numberOfCores', label: 'Number of Cores', type: 'select', options: [
        { label: '16 cores', value: '16 cores' },
        { label: '24 cores', value: '24 cores' },
        { label: '20 cores', value: '20 cores' },
        { label: '14 cores', value: '14 cores' },
        { label: '8 cores', value: '8 cores' },
        { label: '6 cores', value: '6 cores' },
        { label: '4 cores', value: '4 cores' },
        { label: '10 cores', value: '10 cores' },
        { label: '12 cores', value: '12 cores' },
      ] },
      { name: 'socketType', label: 'Socket Type', type: 'select', options: [
        { label: 'AMD AM5', value: 'amd am5' },
        { label: 'Intel 1700 12th/13th/14th Gen', value: 'intel 1700 12th/13th/14th gen' },
        { label: 'AMD AM4', value: 'amd am4' },
        { label: 'Intel 1200 10th/11th Gen', value: 'intel 1200 10th/11th gen' },
        { label: 'Intel LGA1851 15th Gen', value: 'intel lga1851 15th gen' },
      ] },
    ],
    ram: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 108000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'ramBrand', label: 'RAM Brand', type: 'select', options: [
        { label: 'Corsair', value: 'corsair' },
        { label: 'Team', value: 'team' },
        { label: 'G Skill', value: 'g skill' },
        { label: 'ADATA', value: 'adata' },
        { label: 'Transcend', value: 'transcend' },
      ] },
      { name: 'ramCapacity', label: 'RAM Capacity', type: 'select', options: [
        { label: '64GB (32GB x 2)', value: '64gb (32gb x 2)' },
        { label: '32GB (16GB x 2)', value: '32gb (16gb x 2)' },
        { label: '16GB (16GB x 1)', value: '16gb (16gb x 1)' },
        { label: '32GB (32GB x 1)', value: '32gb (32gb x 1)' },
        { label: '8GB (8GB x 1)', value: '8gb (8gb x 1)' },
        { label: '48GB (24GB x 2)', value: '48gb (24gb x 2)' },
      ] },
      { name: 'ramSpeed', label: 'RAM Speed', type: 'select', options: [
        { label: 'DDR5 6000MHz', value: 'ddr5 6000mhz' },
        { label: 'DDR5 6400MHz', value: 'ddr5 6400mhz' },
        { label: 'DDR5 5600MHz', value: 'ddr5 5600mhz' },
        { label: 'DDR4 3200MHz', value: 'ddr4 3200mhz' },
        { label: 'Laptop DDR5 5600MHz', value: 'laptop ddr5 5600mhz' },
        { label: 'Laptop DDR4 3200MHz', value: 'laptop ddr4 3200mhz' },
        { label: 'DDR4 3600MHz', value: 'ddr4 3600mhz' },
        { label: 'DDR5-5200MHz', value: 'ddr5-5200mhz' },
      ] },
    ],
    gpu: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 999000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'gpuChipset', label: 'GPU Chipset', type: 'select', options: [
        { label: 'RTX 4060', value: 'rtx 4060' },
        { label: 'RTX 4060Ti', value: 'rtx 4060ti' },
        { label: 'RTX 4070 Super', value: 'rtx 4070 super' },
        { label: 'RTX 3050', value: 'rtx 3050' },
        { label: 'RTX 5070', value: 'rtx 5070' },
        { label: 'RTX 5080', value: 'rtx 5080' },
        { label: 'RTX 3060', value: 'rtx 3060' },
        { label: 'T1000', value: 't1000' },
        { label: 'T400', value: 't400' },
        { label: 'RTX 5070Ti', value: 'rtx 5070ti' },
        { label: 'GPU Holder', value: 'gpu holder' },
        { label: 'RTX 4090', value: 'rtx 4090' },
        { label: 'GTX 1650', value: 'gtx 1650' },
        { label: 'RTX 5090', value: 'rtx 5090' },
        { label: 'RTX 4080 Super', value: 'rtx 4080 super' },
        { label: 'GT730', value: 'gt730' },
        { label: 'GT 1030', value: 'gt 1030' },
        { label: 'RTX 2000', value: 'rtx 2000' },
        { label: 'AMD RX7600', value: 'amd rx7600' },
        { label: 'RTX A400', value: 'rtx a400' },
        { label: 'GT 710', value: 'gt 710' },
        { label: 'Riser Cable', value: 'riser cable' },
      ] },
      { name: 'gpuManufacturer', label: 'GPU Manufacturer', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'MSI', value: 'msi' },
        { label: 'NVIDIA', value: 'nvidia' },
        { label: 'Zotac', value: 'zotac' },
        { label: 'Corsair', value: 'corsair' },
      ] },
      { name: 'gpuVram', label: 'GPU VRAM', type: 'select', options: [
        { label: '8GB', value: '8gb' },
        { label: '12GB', value: '12gb' },
        { label: '16GB', value: '16gb' },
        { label: '4GB', value: '4gb' },
        { label: '24GB', value: '24gb' },
        { label: '32GB', value: '32gb' },
        { label: '6GB', value: '6gb' },
        { label: '2GB', value: '2gb' },
      ] },
    ],
    powerSupply: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 245000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'brands', label: 'Brands', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Antec', value: 'antec' },
        { label: 'Thermal Take', value: 'thermal take' },
        { label: 'Prolink', value: 'prolink' },
        { label: 'Seasonic', value: 'seasonic' },
      ] },
      { name: 'modularType', label: 'Modular Type', type: 'select', options: [
        { label: 'Full Modular', value: 'full modular' },
        { label: 'Non Modular', value: 'non modular' },
        { label: 'Semi Modular', value: 'semi modular' },
      ] },
      { name: 'powerEfficiency', label: 'Power Efficiency', type: 'select', options: [
        { label: '80+ Titanium', value: '80+ titanium' },
        { label: '80+ Gold', value: '80+ gold' },
        { label: '80+ Platinum', value: '80+ platinum' },
        { label: '80+ Bronze', value: '80+ bronze' },
        { label: 'Non Rated', value: 'non rated' },
      ] },
      { name: 'supplyType', label: 'Type', type: 'select', options: [
        { label: 'Power Supply', value: 'power supply' },
        { label: 'UPS', value: 'ups' },
      ] },
      { name: 'wattage', label: 'Wattage', type: 'select', options: [
        { label: '1600w', value: '1600w' },
        { label: '1200w', value: '1200w' },
        { label: '850w', value: '850w' },
        { label: '750w', value: '750w' },
        { label: '1000w', value: '1000w' },
        { label: '650w', value: '650w' },
        { label: '550w', value: '550w' },
        { label: '450w', value: '450w' },
      ] },
    ],
    casings: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 165000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'casingsManufacturer', label: 'Casings Manufacturer', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'Lian Li', value: 'lian li' },
        { label: 'Antec', value: 'antec' },
        { label: 'Corsair Gamdias', value: 'corsair gamdias' },
        { label: 'Gfield', value: 'gfield' },
        { label: 'MSI', value: 'msi' },
        { label: 'Gigabyte', value: 'gigabyte' },
        { label: 'Cooler Master', value: 'cooler master' },
        { label: 'NZXT', value: 'nzxt' },
        { label: 'Alcatroz', value: 'alcatroz' },
        { label: 'Viper', value: 'viper' },
      ] },
      { name: 'chassisColor', label: 'Chassis Color', type: 'select', options: [
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Black & White', value: 'black & white' },
      ] },
      { name: 'motherboardSupportSize', label: 'Motherboard Support Size', type: 'select', options: [
        { label: 'E-ATX', value: 'e-atx' },
        { label: 'Mini-ITX', value: 'mini-itx' },
        { label: 'ATX', value: 'atx' },
        { label: 'M-ATX', value: 'm-atx' },
        { label: 'ITX', value: 'itx' },
        { label: 'Micro-ATX', value: 'micro-atx' },
      ] },
    ],
    monitors: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 782000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'manufacturer', label: 'Manufacturer', type: 'select', options: [
        { label: 'MSI', value: 'msi' },
        { label: 'ASUS', value: 'asus' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Lenovo', value: 'lenovo' },
        { label: 'Acer', value: 'acer' },
        { label: 'Viewsonic', value: 'viewsonic' },
        { label: 'HP', value: 'hp' },
        { label: 'LG', value: 'lg' },
        { label: 'Dell', value: 'dell' },
      ] },
      { name: 'monitorType', label: 'Monitor Type', type: 'select', options: [
        { label: 'Gaming Monitor', value: 'gaming monitor' },
        { label: 'Personal Monitor', value: 'personal monitor' },
        { label: 'Professional Monitor', value: 'professional monitor' },
      ] },
      { name: 'panelType', label: 'Panel Type', type: 'select', options: [
        { label: 'OLED', value: 'oled' },
        { label: 'VA', value: 'va' },
        { label: 'IPS', value: 'ips' },
        { label: 'TN', value: 'tn' },
      ] },
      { name: 'recommendedResolution', label: 'Recommended Resolution', type: 'select', options: [
        { label: '5120 x 1440', value: '5120 x 1440' },
        { label: '2560 x 1440', value: '2560 x 1440' },
        { label: '3440 x 1440', value: '3440 x 1440' },
        { label: '1920 x 1080', value: '1920 x 1080' },
        { label: '3840 x 2160', value: '3840 x 2160' },
        { label: '1366 x 768', value: '1366 x 768' },
        { label: '2560 x 1080', value: '2560 x 1080' },
        { label: '3840 x 1080', value: '3840 x 1080' },
        { label: '2560 x 2880', value: '2560 x 2880' },
      ] },
      { name: 'refreshRate', label: 'Refresh Rate', type: 'select', options: [
        { label: '144hz', value: '144hz' },
        { label: '360hz', value: '360hz' },
        { label: '175hz', value: '175hz' },
        { label: '170hz', value: '170hz' },
        { label: '180hz', value: '180hz' },
        { label: '100hz', value: '100hz' },
        { label: '250hz', value: '250hz' },
        { label: '240hz', value: '240hz' },
        { label: '60hz', value: '60hz' },
        { label: '75hz', value: '75hz' },
        { label: '165hz', value: '165hz' },
        { label: '120hz', value: '120hz' },
        { label: '160hz', value: '160hz' },
        { label: '220hz', value: '220hz' },
        { label: '155hz', value: '155hz' },
        { label: '200hz', value: '200hz' },
      ] },
      { name: 'screenSize', label: 'Screen Size', type: 'select', options: [
        { label: '49 inch', value: '49 inch' },
        { label: '27 inch', value: '27 inch' },
        { label: '34 inch', value: '34 inch' },
        { label: '32 inch', value: '32 inch' },
        { label: '24 inch', value: '24 inch' },
        { label: '45 inch', value: '45 inch' },
        { label: '25 inch', value: '25 inch' },
        { label: '19 inch', value: '19 inch' },
        { label: '22 inch', value: '22 inch' },
        { label: '15 inch', value: '15 inch' },
        { label: '30 inch', value: '30 inch' },
        { label: '39 inch', value: '39 inch' },
        { label: '28 inch', value: '28 inch' },
        { label: '40 inch', value: '40 inch' },
        { label: '20 inch', value: '20 inch' },
      ] },
    ],
    coolers: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 159500, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'coolerManufacturer', label: 'Cooler Manufacturer', type: 'select', options: [
        { label: 'Gamdias', value: 'gamdias' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Antec', value: 'antec' },
        { label: 'ASUS', value: 'asus' },
        { label: 'Cooler Master', value: 'cooler master' },
        { label: 'Lian Li', value: 'lian li' },
        { label: 'MSI', value: 'msi' },
        { label: 'Noctua', value: 'noctua' },
        { label: 'NZXT', value: 'nzxt' },
        { label: 'ADATA', value: 'adata' },
        { label: 'Thermal Grizzly', value: 'thermal grizzly' },
        { label: 'Silvers Tone', value: 'silvers tone' },
        { label: 'AceGeek', value: 'acegeek' },
      ] },
    ],
    keyboard: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 145000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'connectivity', label: 'Connectivity', type: 'select', options: [
        { label: 'Wireless', value: 'wireless' },
        { label: 'Wired', value: 'wired' },
      ] },
      { name: 'manufacturer', label: 'Manufacturer', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Fantech', value: 'fantech' },
        { label: 'Gamdias', value: 'gamdias' },
        { label: 'HyperX', value: 'hyperx' },
        { label: 'Logitech', value: 'logitech' },
        { label: 'Prolink', value: 'prolink' },
        { label: 'MI', value: 'mi' },
        { label: 'MSI', value: 'msi' },
        { label: 'Galax', value: 'galax' },
        { label: 'Lenovo', value: 'lenovo' },
        { label: 'ADATA', value: 'adata' },
        { label: 'HP', value: 'hp' },
      ] },
      { name: 'mechanical', label: 'Mechanical', type: 'select', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ] },
    ],
    mouse: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 145000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'connectivity', label: 'Connectivity', type: 'select', options: [
        { label: 'Wireless', value: 'wireless' },
        { label: 'Wired', value: 'wired' },
      ] },
      { name: 'manufacturer', label: 'Manufacturer', type: 'select', options: [
        { label: 'ASUS', value: 'asus' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Fantech', value: 'fantech' },
        { label: 'Gamdias', value: 'gamdias' },
        { label: 'HyperX', value: 'hyperx' },
        { label: 'Logitech', value: 'logitech' },
        { label: 'Prolink', value: 'prolink' },
        { label: 'MI', value: 'mi' },
        { label: 'MSI', value: 'msi' },
        { label: 'Galax', value: 'galax' },
        { label: 'Lenovo', value: 'lenovo' },
        { label: 'ADATA', value: 'adata' },
        { label: 'HP', value: 'hp' },
      ] },
      { name: 'mechanical', label: 'Mechanical', type: 'select', options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ] },
    ],
    soundSystems: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 132500, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'soundConnectivity', label: 'Sound Connectivity', type: 'select', options: [
        { label: 'Wired', value: 'wired' },
        { label: 'Wireless', value: 'wireless' },
      ] },
      { name: 'soundManufacturer', label: 'Sound Manufacturer', type: 'select', options: [
        { label: 'Corsair', value: 'corsair' },
        { label: 'Soundpeats', value: 'soundpeats' },
        { label: 'ASUS', value: 'asus' },
        { label: 'Fantech', value: 'fantech' },
        { label: 'HyperX', value: 'hyperx' },
        { label: 'Logitech', value: 'logitech' },
        { label: 'NZXT', value: 'nzxt' },
        { label: 'Razer', value: 'razer' },
        { label: 'Sonicgear', value: 'sonicgear' },
        { label: 'Noise', value: 'noise' },
        { label: 'Patriot', value: 'patriot' },
        { label: 'MSI', value: 'msi' },
        { label: 'Microlab', value: 'microlab' },
        { label: 'Sennheiser', value: 'sennheiser' },
        { label: 'Anker Ugreen', value: 'anker ugreen' },
      ] },
      { name: 'soundType', label: 'Sound Type', type: 'select', options: [
        { label: 'Headset', value: 'headset' },
        { label: 'Buds', value: 'buds' },
        { label: 'Speakers', value: 'speakers' },
        { label: 'Headset', value: 'headset' },
      ] },
    ],
    cables: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 15000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'cableLength', label: 'Cable Length', type: 'select', options: [
        { label: '2m', value: '2m' },
        { label: '1.5m', value: '1.5m' },
        { label: '1m', value: '1m' },
        { label: '3m', value: '3m' },
        { label: '0.8m', value: '0.8m' },
      ] },
      { name: 'productType', label: 'Product Type', type: 'select', options: [
        { label: 'DP/HDMI', value: 'dp/hdmi' },
        { label: 'Hub/Converters', value: 'hub/converters' },
        { label: 'Tools', value: 'tools' },
        { label: 'Router', value: 'router' },
        { label: 'Bluetooth', value: 'bluetooth' },
        { label: 'Gaming Router', value: 'gaming router' },
        { label: 'Mobile Router', value: 'mobile router' },
        { label: 'Wifi / WLAN', value: 'wifi / wlan' },
        { label: 'Type C (Thunderbolt)', value: 'type c (thunderbolt)' },
        { label: 'Surge Protector', value: 'surge protector' },
        { label: 'Cable Converters', value: 'cable converters' },
        { label: 'Network Cable (Ethernet)', value: 'network cable (ethernet)' },
      ] },
    ],
    storage: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 276000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'storageCapacity', label: 'Storage Capacity', type: 'select', options: [
        { label: '2TB', value: '2tb' },
        { label: '1TB', value: '1tb' },
        { label: '2 NAS Drive Bays', value: '2 nas drive bays' },
        { label: '4 NAS Drive Bays', value: '4 nas drive bays' },
        { label: '512GB', value: '512gb' },
        { label: '6 NAS Drive Bays', value: '6 nas drive bays' },
        { label: '500GB', value: '500gb' },
        { label: '256GB', value: '256gb' },
        { label: '4TB', value: '4tb' },
        { label: '6TB', value: '6tb' },
        { label: '8TB', value: '8tb' },
        { label: '10TB', value: '10tb' },
      ] },
      { name: 'storageManufacturer', label: 'Storage Manufacturer', type: 'select', options: [
        { label: 'Samsung', value: 'samsung' },
        { label: 'Asustor', value: 'asustor' },
        { label: 'Team', value: 'team' },
        { label: 'Addlink', value: 'addlink' },
        { label: 'Seagate', value: 'seagate' },
        { label: 'Western Digital', value: 'western digital' },
        { label: 'Toshiba', value: 'toshiba' },
        { label: 'Lexar', value: 'lexar' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Kingston', value: 'kingston' },
      ] },
      { name: 'storageType', label: 'Storage Type', type: 'select', options: [
        { label: 'SSD M.2', value: 'ssd m.2' },
        { label: 'NAS Device', value: 'nas device' },
        { label: 'SSD SATA', value: 'ssd sata' },
        { label: 'Desktop Hard Disk', value: 'desktop hard disk' },
        { label: 'Laptop Hard Disk', value: 'laptop hard disk' },
        { label: 'NAS Drive', value: 'nas drive' },
      ] },
    ],
    externalStorage: [
      { name: 'price', label: 'Price', type: 'number', min: 0, max: 138000, placeholder: 'Enter price in LKR' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { label: 'Out of Stock', value: 'out of stock' },
        { label: 'In Stock', value: 'in stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ] },
      stateField,
      { name: 'externalStorageBrand', label: 'External Storage Brand', type: 'select', options: [
        { label: 'Western Digital', value: 'western digital' },
        { label: 'Corsair', value: 'corsair' },
        { label: 'Team', value: 'team' },
        { label: 'Sandisk', value: 'sandisk' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Transcend', value: 'transcend' },
        { label: 'ASUS ADATA', value: 'asus adata' },
        { label: 'UGREEN', value: 'ugreen' },
      ] },
      { name: 'externalStorageCapacity', label: 'External Storage Capacity', type: 'select', options: [
        { label: '1TB', value: '1tb' },
        { label: '2TB', value: '2tb' },
        { label: '4TB', value: '4tb' },
        { label: '5TB', value: '5tb' },
        { label: '6TB', value: '6tb' },
        { label: '500GB', value: '500gb' },
        { label: '64GB', value: '64gb' },
        { label: '128GB', value: '128gb' },
        { label: '256GB', value: '256gb' },
      ] },
      { name: 'externalStorageType', label: 'External Storage Type', type: 'select', options: [
        { label: 'Portable Hard Disk', value: 'portable hard disk' },
        { label: 'Portable SSD', value: 'portable ssd' },
        { label: 'Pendrive', value: 'pendrive' },
        { label: 'External HDD Case', value: 'external hdd case' },
        { label: '2.5 SATA Enclosure', value: '2.5 sata enclosure' },
      ] },
    ],
  };
  
  
  const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedProductType, setSelectedProductType] = useState("");
    const [product, setProduct] = useState({
      price: "",
      availability: "",
      state: "",
      description: "",
    });
    
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    // Handle selection of product type
    const handleProductTypeSelect = (type) => {
      setSelectedProductType(type);
      setProduct((prev) => ({
        ...prev,
        category: type,
      }));
    };
  
    // Update product state based on user input
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    // Submit product data to the backend
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
    
      // Common fields that are not considered "specs"
      const commonFields = ['price', 'availability', 'state', 'description', 'category'];
    
      // Build the specs array
      const specs = productFields[selectedProductType].reduce((acc, field) => {
        // If the field is not one of the common ones, it is a spec field
        if (!commonFields.includes(field.name)) {
          // Only include if there's a value
          if (product[field.name]) {
            acc.push({
              key: field.name,
              value: product[field.name],
            });
          }
        }
        return acc;
      }, []);
    
      // Prepare product data
      // Optionally, remove spec keys from the top level if you only want them under "specs"
      const productData = {
        price: product.price,
        availability: product.availability,
        state: product.state,
        description: product.description,
        category: product.category,
        image, // from separate state
        specs, // our transformed specifications
      };
    
      try {
        const response = await axios.post("http://localhost:5000/api/products", productData);
        if (response.status === 201) {
          alert("Product added successfully!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        alert("Error adding product.");
      } finally {
        setIsLoading(false);
      }
    };
    
  
    const inputClass =
      "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
    const textAreaClass =
      "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none";
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-6">
            Add New Product
          </h2>
          {!selectedProductType ? (
            // Product type selection buttons
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {productTypes.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => handleProductTypeSelect(pt.value)}
                  className="px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition transform hover:scale-105"
                >
                  {pt.label}
                </button>
              ))}
            </div>
          ) : (
            
            // Render the form with fields for the selected product type
            <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-700 underline underline-offset-8 decoration-4 decoration-blue-500">
                {selectedProductType}
                </h3>
                            {/* Dynamically render fields based on selected product type */}
                            {productFields[selectedProductType]?.map((field, idx) =>
                field.type === "select" ? (
                  <div key={idx} className="space-y-2">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <select
                      id={field.name}
                      name={field.name}
                      value={product[field.name] || ""}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div key={idx} className="space-y-2">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder || ""}
                      value={product[field.name] || ""}
                      onChange={handleChange}
                      className={inputClass}
                      min={field.min}
                      max={field.max}
                    />
                  </div>
                )
              )}

  
              {/* Add description input */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description..."
                  value={product.description}
                  onChange={handleChange}
                  className={textAreaClass}
                ></textarea>
              </div>
  
              {/* Image upload */}
              <UploadImage name="image" setImage={setImage} />
  
              {/* Form buttons */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductType("")}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400 transition"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };
  
  export default AddProduct;