import React from "react";
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "./FooterStyle";

const Footer = () => {
return (
	<Box>
	<h1 style={{ color: "orange",
				textAlign: "center",
				marginTop: "-50px" }}>
		Следите за нами в соц. сетях
	</h1>
	<Container>
		<Row>
		<Column>
			<Heading>Services</Heading>
			<FooterLink href="#">GitHub</FooterLink>
			<FooterLink href="#">...</FooterLink>
			<FooterLink href="#">...</FooterLink>
			<FooterLink href="#">...</FooterLink>
		</Column>
		<Column>
			<Heading>Contacts</Heading>
			<FooterLink href="#">...</FooterLink>
			<FooterLink href="#">...</FooterLink>
			<FooterLink href="#">...</FooterLink>
			<FooterLink href="#">...</FooterLink>
		</Column>
		<Column>
			<Heading>Social Media</Heading>
			<FooterLink href="#">
			<i className="fab fa-facebook-f">
				<span style={{ marginLeft: "10px" }}>
				Facebook
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-instagram">
				<span style={{ marginLeft: "10px" }}>
				Instagram
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-twitter">
				<span style={{ marginLeft: "10px" }}>
				Twitter
				</span>
			</i>
			</FooterLink>
			<FooterLink href="#">
			<i className="fab fa-youtube">
				<span style={{ marginLeft: "10px" }}>
				Youtube
				</span>
			</i>
			</FooterLink>
		</Column>
		</Row>
	</Container>
	</Box>
);
};
export default Footer;
