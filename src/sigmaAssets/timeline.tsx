import React, { ChangeEvent, useEffect, useState, CSSProperties } from "react";
import { Attributes } from "graphology-types";
import {useCamera, useRegisterEvents, useSigma} from "@react-sigma/core";
import {getUniqueKey} from "/Users/lewis/repos/github.com/lewiswon/graphing-sigma/node_modules/@react-sigma/core/src/utils";
type SearchLabelKeys = "text" | "placeholder";

/**
 * Properties for `SearchControl` component
 */
export interface SearchControlProps {
    /**
     * HTML id
     */
    id?: string;

    /**
     * HTML class
     */
    className?: string;

    /**
     * HTML CSS style
     */
    style?: CSSProperties;

    /**
     * Map of the labels we use in the component.
     * This is usefull for I18N
     */
    labels?: { [Key in SearchLabelKeys]?: string };
}

/**
 * The `SearchControl` create an input text where user can search a node in the graph by its label.
 * There is an autocomplete based on includes & lower case.
 * When a node is found, the graph will focus on the highlighted node
 *
 * ```jsx
 * <SigmaContainer>
 *   <ControlsContainer>
 *     <SearchControl />
 *   </ControlsContainer>
 * </SigmaContainer>
 * ```
 * See [[SearchControlProps]] for more information.
 *
 * @category Component
 */
export const TimelineControl: React.FC<SearchControlProps> = ({
                                                                id,
                                                                className,
                                                                style,
                                                                labels = {},
                                                            }: SearchControlProps) => {
    // Get sigma
    const sigma = useSigma();
    // Get event hook
    const registerEvents = useRegisterEvents();
    // Get camera hook
    const { gotoNode } = useCamera();
    // Search value
    const [search, setSearch] = useState<string>("");
    // Datalist values
    const [values, setValues] = useState<Array<{ id: string; label: string }>>([]);
    // Selected
    const [selected, setSelected] = useState<string | null>(null);
    // random id for the input
    const [inputId, setInputId] = useState<string>("");
    const [, setEdges] = useState<Array<{ id: string; timestamp: Date; hidden: boolean }>>([]);

    /**
     * When component mount, we set a random input id.
     */
    useEffect(() => {
        setInputId(`search-${getUniqueKey()}`);
    }, []);

    /**
     * When the search input changes, recompute the autocomplete values.
     */
    useEffect(() => {
        const newValues: Array<{ id: string; label: string }> = [];
        const newEdges: Array<{ id: string; timestamp: Date; hidden: boolean}> = [];
        sigma.getGraph().forEachEdge((key: string, attribute: Attributes): void => {
            console.log("attributes are:", key, attribute);
            if (attribute.timestamp === new Date(search)) {
                newEdges.push({id: key, timestamp: new Date(search), hidden: false})
            }
            else {
                newEdges.push({id: key, timestamp: new Date(search), hidden: true})
            }
        })
        sigma.setSetting("edgeReducer", (edge: string, data: Attributes) => {
            console.log("edge", data, edge);
            console.log("The datetime is,", new Date(search));
            console.log("The timestamp is:", data.timestamp);
            console.log("equality:", data.timestamp.getTime() === new Date(search).getTime());
            // if (data.timestamp.getTime() == new Date(search).getTime()) {
            //     return {
            //         ...data,
            //         hidden: false
            //     }
            // }
            return {
                ...data,
                hidden: false
            }
        })
        if (!selected && search.length > 1) {
            sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
                console.log("nodes are:", key, attributes);
                if (attributes.label && attributes.label.toLowerCase().includes(search.toLowerCase()))
                    newValues.push({ id: key, label: attributes.label });
            });
        }
        setValues(newValues);
        setEdges(newEdges);
        console.log("the graph is:", JSON.stringify(sigma.getGraph()))
    }, [search, selected, sigma]);

    /**
     * When use clik on the stage
     *  => reset the selection
     */
    useEffect(() => {
        registerEvents({
            clickStage: () => {
                setSelected(null);
                setSearch("");
            },
        });
    }, [registerEvents]);

    /**
     * When the selected item changes, highlighted the node and center the camera on it.
     */
    useEffect(() => {
        if (!selected) {
            return;
        }

        sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
        gotoNode(selected);

        return () => {
            sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
        };
    }, [gotoNode, selected, sigma]);

    /**
     * On change event handler for the search input, to set the state.
     */
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchString = e.target.value;
        const valueItem = values.find((value) => value.label === searchString);
        if (valueItem) {
            setSearch(valueItem.label);
            setValues([]);
            setSelected(valueItem.id);
        } else {
            setSelected(null);
            setSearch(searchString);
        }
    };

    // Common html props for the div
    const htmlProps = {
        className: `react-sigma-search ${className ? className : ""}`,
        id,
        style,
    };

    return (
        <div {...htmlProps}>
            <label htmlFor={inputId} style={{ display: "none" }}>
                {labels["text"] || "Search a node"}
            </label>
            <input
                id={inputId}
                type="text"
                placeholder={labels["placeholder"] || "Search..."}
                list={`${inputId}-datalist`}
                value={search}
                onChange={onInputChange}
            />
            <datalist id={`${inputId}-datalist`}>
                {values.map((value: { id: string; label: string }) => (
                    <option key={value.id} value={value.label}>
                        {value.label}
                    </option>
                ))}
            </datalist>
        </div>
    );
};
