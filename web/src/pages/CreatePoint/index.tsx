import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import './styles.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    // Sempre que se cria um arry ou objeto precisa informar manualmente o formato
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selectUf, setSelectUf] = useState("0");
    const [selectCity, setSelectCity] = useState("0");
    const [selectPosition, setSelectPosition] = useState<[number, number]>([0, 0]);
    const [selectItems, setSelectItems] = useState<number[]>([]);
    const [selectFile, setSelectFile] = useState<File>();
    const [initalPosition, setInitalPosition] = useState<[number, number]>([0, 0]);

    const history = useHistory();

    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data);
            });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(response => {
                const ufInitials = response.data.map(x => x.sigla);

                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        if (selectUf === "0") return;

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`)
            .then(response => {
                const citiesNames = response.data.map(x => x.nome);

                setCities(citiesNames);
            });
    }, [selectUf]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitalPosition([latitude, longitude]);
        })
    }, []);

    function handlerSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectUf(uf);
    }

    function handlerSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectCity(city);
    }

    function handlerMapClick(event: LeafletMouseEvent) {
        setSelectPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handlerInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    }

    function handlerSelectItem(id: number) {
        const alreadySelected = selectItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectItems.filter(item => item !== id);

            setSelectItems(filteredItems);
        }
        else {
            setSelectItems([...selectItems, id]);
        }
    }

    async function handlerSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const [latitude, longitude] = selectPosition;
        const uf = selectUf;
        const city = selectCity;
        const items = selectItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectFile)
            data.append('image', selectFile);

        console.log(data)

        await api.post("points", data);

        history.push("/success-create-point");
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <Dropzone onFileUploaded={setSelectFile} />

            <form onSubmit={handlerSubmit}>
                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Coloque o nome da entidade"
                            onChange={handlerInputChange}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Coloque o email de contanto"
                                onChange={handlerInputChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="number"
                                name="whatsapp"
                                id="whatsapp"
                                placeholder="Coloque o número"
                                onChange={handlerInputChange}
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initalPosition} zoom={15} onClick={handlerMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label>Estado (UF)</label>
                            <select
                                onChange={handlerSelectUf}
                                value={selectUf}
                                name="uf"
                                id="uf">
                                <option value="0">
                                    Selecione uma UF
                               </option>
                                {
                                    ufs.map(item => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="field">
                            <label>Cidade</label>
                            <select
                                name="city"
                                id="city"
                                onChange={handlerSelectCity}
                                value={selectCity}
                            >
                                <option value="0">
                                    Selecione uma cidade
                               </option>
                                {
                                    cities.map(item => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais intens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => handlerSelectItem(item.id)}
                                    className={selectItems.includes(item.id) ? 'selected' : ''}>
                                    <img src={item.image_url} alt={item.name} />
                                    <span>{item.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>

                <button type='submit'>Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
};

export default CreatePoint;